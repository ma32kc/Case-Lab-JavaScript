import {fetchData} from './helpers/fetch.js'
import {moveElementToEnd} from './helpers/moveElementToEnd.js'
import {sortCompleted} from './helpers/sortCompleted.js'

document.addEventListener ("DOMContentLoaded", async () => {
    const todoList = document.querySelector ('.todoList'); // список с задачами
    const evenButton = document.querySelector ('#evenButton'); // кнопка для четных эл.
    const oddButton = document.querySelector ('#oddButton'); // кнопка для нечетных эл.
    const firstButton = document.querySelector ('#firstButton'); // кнопка для удаления первого эл.
    const lastButton = document.querySelector ('#lastButton'); // кнопка для удаления последнего эл.
    const submitButton = document.querySelector ('#submitButton'); // кнопка для отправки формы

    async function updateTodoList () {
        todoList.innerHTML = ''; // Очищаем список перед обновлением

        let todos = JSON.parse (localStorage.getItem ('todos')) // парсим задачи из сторэджа

        if (!todos) {
            todos = await fetchData ('https://jsonplaceholder.typicode.com/todos?_limit=7') // парсим задачи
            localStorage.setItem ('todos', JSON.stringify (todos)) // сохраняем задачи в сторэдж
        }

        todos.forEach (todo => {
            let li = document.createElement ("li");
            let buttons = document.createElement ("div");
            let checkButton = document.createElement ("button"); // кнопка для отметки эл.
            let deleteButton = document.createElement ("button") // кнопка для удаления эл.
            let text = document.createElement ("p");
            text.innerText = todo.title;
            text.className = "todoText"
            li.className = "todoElement"
            li.dataset.completed = todo.completed
            li.dataset.id = todo.id
            buttons.className = "buttons"
            checkButton.innerText = "Отметить"
            checkButton.className = "todoButton"
            deleteButton.innerText = "Удалить"
            deleteButton.className = "deleteButton todoButton"

            checkButton.addEventListener ('click', () => {
                let todo = todos.find (el => + el.id === + li.dataset.id)
                if (!todo.completed) {
                    moveElementToEnd (todos, todo) // переставленние элемента в конец списка
                }
                todo.completed = !(li.dataset.completed === 'true');
                todos.sort (sortCompleted);
                localStorage.setItem ('todos', JSON.stringify (todos));
                updateTodoList (); // визуальное обновление списка
            });

            deleteButton.addEventListener ('click', () => {
                let todo = todos.find (el => + el.id === + li.dataset.id)
                todos = todos.filter (el => el.id !== todo.id)
                todos.sort (sortCompleted);
                localStorage.setItem ('todos', JSON.stringify (todos));
                updateTodoList ();
            })

            todoList.append (li)
            li.append (text)
            li.append (buttons)
            buttons.append (checkButton)
            buttons.append (deleteButton)
        });
    }

    // Инициализация списка при загрузке страницы
    await updateTodoList ();

    evenButton.addEventListener ('click', () => {
        todoList.childNodes.forEach ((todo, index) => {
            if ((index + 1) % 2 === 0) {
                todo.classList.toggle ('even')
            }
        })
    })

    oddButton.addEventListener ('click', () => {
        todoList.childNodes.forEach ((todo, index) => {
            if ((index + 1) % 2 !== 0) {
                todo.classList.toggle ('odd')
            }
        })
    })

    firstButton.addEventListener ('click', () => {
        let todos = JSON.parse (localStorage.getItem ('todos'))

        todos.shift ()
        todos.sort (sortCompleted)
        localStorage.setItem ('todos', JSON.stringify (todos));
        updateTodoList ();
    })

    lastButton.addEventListener ('click', () => {
        let todos = JSON.parse (localStorage.getItem ('todos'))

        todos.pop ()
        todos.sort (sortCompleted)
        localStorage.setItem ('todos', JSON.stringify (todos));
        updateTodoList ();
    })

    submitButton.addEventListener ('click', async e => {
        e.preventDefault ()

        let todos = JSON.parse (localStorage.getItem ('todos'))
        const inputValue = document.querySelector ('#todoTitle').value.trim ()

        if (inputValue.length > 0) {
            const todo = {
                userId: + Date.now (),
                id: + Date.now (),
                title: inputValue,
                completed: false
            }
            todos.push (todo)
            todos.sort (sortCompleted)
            localStorage.setItem ('todos', JSON.stringify (todos));
            await updateTodoList ();
        }
    })

    // Добавить обработчик события storage для автоматического обновления
    window.addEventListener ('storage', (event) => {
        if (event.key === 'todos') {
            updateTodoList ()
        }
    });
});