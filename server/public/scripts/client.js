$(document).ready(onReady);

function onReady() {
    $('#add-task-button').on('click', addTask);

    $('#task-list').on('click', '.toggle-task', toggleTask);
    $('#task-list').on('click', '.delete', deleteTask);
    $('#qr_trigger').on('mouseenter', showQrCode);
    $('#qr_trigger').on('mouseleave', hideQrCode);

    fetchTasksAndRender();
}

function showQrCode() {
    console.log('on');
    let qr_div = new QRCode(document.getElementById("qr_div"),
        {
            text: "https://youtu.be/dQw4w9WgXcQ?feature=shared",
            width: 175,
            height: 175,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
}

function hideQrCode() {
    console.log('off');
    $('#qr_div').empty();
}

function fetchTasksAndRender() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
    }).then(
        function (response) {
            console.log('GET /tasks call successful');
            console.log('response:', response);
            updateTasksOnDOM(response);
        }
    ).catch(
        function (error) {
            console.log('GET /tasks call failed');
            console.log('error:', error);
        }
    );
}

let thingsNotDone = [
    'give you up',
    'let you down',
    'run around',
    'desert you',
    'make you cry',
    'say goodbye',
    'tell a lie',
    'hurt you',
];

function updateTasksOnDOM(listOfTasks) {
    $('#task-list').empty();

    for (let task of listOfTasks) {

        let is_rollable = !thingsNotDone.every(item => { return !task.task_name.toLowerCase().includes(item) });

        if (is_rollable) {
            $('#task-list').append(
                `<li>
                    <span><img src="./media/george_hw_bush.png" alt="Picture of George HW Bush Sr, famous for saying 'not gonna do it'" width="16" height="18.29"></span>
                    ${task.task_name}
                    <span class="delete">∅</span>
                </li>`
            )
        } else if (task.is_complete === true) {
            $('#task-list').append(
                `<li class="complete-task" data-id=${task.uuid}>
                    <span class="toggle-task">☑️</span>
                    ${task.task_name}
                    <span class="delete">🗑️</span>
                </li>`
            )
        } else {
            $('#task-list').append(
                `<li data-id=${task.uuid}>
                    <span class="toggle-task">✅</span>
                    ${task.task_name}
                    <span class="delete">🗑️</span>
                </li>`
            )
        }
    }

}

function addTask(event) {
    event.preventDefault();

    let newTask = {};

    try {
        newTask = validateNewTask();
    } catch (err) {
        console.log('Invalid task:', err.message);
        alert(`Invalid task: ${err.message}`);

        $('#new-task').val('');

        return;
    }

    console.log('newTask:', newTask);

    $('#new-task').val('');

    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
    }).then(
        function (response) {
            console.log('POST /tasks call successful');
            console.log('response:', response);
            fetchTasksAndRender();
        }
    ).catch(
        function (error) {
            console.log('POST /tasks call failed');
            console.log('error:', error);
        }
    )
}

function validateNewTask() {

    let taskName = $('#new-task').val();

    if (taskName.length === 0) {
        throw new Error("Task Description is blank.");
    } else if (taskName.length > 250) {
        throw new Error("Task Description is too long, it must be less than 250 characters.");
    }

    let newTask = {
        taskName,
    };

    console.log('newTask:', newTask);

    return newTask;
}

function deleteTask() {

    let idToDelete = $(this).parent().data('id');

    console.log('idToDelete:', idToDelete);

    $.ajax({
        method: 'DELETE',
        url: `/tasks/${idToDelete}`
    }).then(function (response) {
        console.log('DELETE /tasks call successful');
        console.log('response:', response);
        fetchTasksAndRender();
    }).catch(function (error) {
        console.log('DELETE /tasks call failed');
        console.log('error:', error);
    })

}

function toggleTask() {
    let idToUpdate = $(this).parent().data('id');

    console.log('idToUpdate:', idToUpdate);

    $.ajax({
        method: 'PUT',
        url: `/creatures/${idToUpdate}`,
    }).then(function (response) {
        console.log('PUT /tasks call successful');
        console.log('response:', response);
        fetchTasksAndRender();
    }).catch(function (error) {
        console.log('PUT /tasks call failed');
        console.log('error:', error);
    })

}

