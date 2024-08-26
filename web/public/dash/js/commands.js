const commands = document.querySelectorAll('[data-command]')

for (const command of commands) {
    command
        .addEventListener('click', async (event) => {
            await save()
        })
}

async function save() {
    const json = {}

    for (const command of commands) {
        json[command.dataset.command] = command.checked
    }

    const res = await fetch('/api/commands', {
        method: "POST",
        body: JSON.stringify({
            commands: json
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
    
    if (res.status === 400) {
        const data = await res.json()

        return console.log(data.error);
    }
}