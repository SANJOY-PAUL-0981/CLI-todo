#!/usr/bin/env node
//this is a shebang

const term = require('terminal-kit').terminal;

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
const todosFile = path.join(__dirname, 'todos.json');

// Utility function to read todos from the file
function readTodos() {
    if (!fs.existsSync(todosFile)) {
        return [];
    }
    const data = fs.readFileSync(todosFile, 'utf8');
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}

// Utility function to write todos to the file
function writeTodos(todos) {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

// Description
program
    .name('CLI todo')
    .description('CLI based todo application')
    .version('1.0.0')

// Add todo
program.command('add <todo>')
    .description('add command will add tasks in todo')
    .action((todo) => {
        const todos = readTodos();
        todos.push({ task: todo, done: false });
        writeTodos(todos);
        term.bold.cyan(`Added: `).bold.yellow(`"${todo}"`);
    });

// Delete todo
program.command('delete <index>')
    .description('Delete a todo with index number')
    .action((index) => {
        const todos = readTodos();
        const del = todos.splice(index, 1);
        writeTodos(todos);
        term.bold.red(`Deleted: `).bold.yellow(`"${del[0].task}"`)
    });

// Mark as done
program.command('done <index>')
    .description('Mark a todo as done by its index')
    .action((index) => {
        const todos = readTodos();
        if (todos[index]) {
            todos[index].done = true;
            writeTodos(todos);
            term.bold.brightGreen(`Marked as done: `).bold.brightCyan(`"${todos[index].task}"`);
        }
        else {
            term.bold.red('Todo Not Found');
        }
    });

// Edit todo
program.command('edit <index> <newTodo>')
    .description('Edit todo by index and replacing the old task with new task')
    .action((index, newTodo) => {
        const todos = readTodos();
        if (todos[index]) {
            const oldTodo = todos[index].task;
            todos[index].task = newTodo;
            writeTodos(todos);
            term.bold.cyan(`Todo Edited: `).bold.red(`"${oldTodo}"`).bold.cyan(` to `).bold.green(`"${newTodo}"`);
        }
        else {
            term.bold.red(`Todo not found`);
        }
    });

// List all todo
program.command('list')
    .description('List all todo tasks')
    .action(() => {
        const todos = readTodos();
        if (todos.lenght === 0) {
            term.bold.red('No todos found');
        }
        else {
            todos.forEach((todo, index) => {
                let status;
                if (todo.done) {
                    status = 'X'; // Mark as done
                } else {
                    status = ' '; // Not done
                }
                term.bold.magenta(`${index}. ${todo.task} [${status}]\n`);
            });
        }
    });

program.parse();
