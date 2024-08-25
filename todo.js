#!/usr/bin/env node

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
function writeTodos(todos){
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
        todos.push({ task: todo, done: false});
        writeTodos(todos);
        term.bold.cyan(`Added: `).bold.yellow(`"${todo}"`);
    });

// Delete todo
program.parse();
