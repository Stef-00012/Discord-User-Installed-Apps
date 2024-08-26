const commandElements = document.querySelectorAll('[data-type="command"]')
const inputs = document.querySelectorAll('[data-type="input"]')

// To expand and collapse cards (Permissions page)
function toggleCard(card) {
	card.classList.toggle("collapsed");
	card.classList.toggle("expanded");

	if (card.classList.contains("expanded")) {
		card.querySelector("input").focus();
	}
}

// To add IDs (Permissions page)
function addId(commandName) {
	const input = document.querySelector(`[data-type="input"][data-command="${commandName}"]`);
	const idList = document.querySelector(`[data-type="list"][data-command="${commandName}"]`);

	if (input.value.trim() !== "") {
		const li = document.createElement("li");
		li.innerHTML = `<span>${input.value}</span><button class="remove-id" onclick="removeId(this)">X</button>`;
		idList.appendChild(li);
		input.value = ""; // Clear the input field
	}
}

// To remove IDs (Permissions page)
async function removeId(button) {
	const listItem = button.parentElement;
	listItem.remove();

	await save()
}

function validateId(id) {
	return /^\d{15,21}$/.test(id)
}

async function save() {
	const json = {}

	for (const command of commandElements) {
		const list = command.querySelector('[data-type="list"]')
		const commandName = list.dataset.command

		const listItems = Array
			.from(list.children)
			.map(listItem => listItem.querySelector('span').textContent)

		json[commandName] = listItems
	}

	const res = await fetch('/api/permissions', {
		method: "POST",
		body: JSON.stringify({
			permissions: json
		}),
		headers: {
			'Content-Type': "application/json"
		}
	})

	if (res.status === 201) return;

	if (res.status === 400) {
		const data = await res.json()

		console.log(data.error)
	}
}

for (const input of inputs) {
	input
		.addEventListener('keydown', async (event) => {
			if (event.key === "Enter") {
				const valid = validateId(input.value)

				if (!valid) {
					input.value = '';

					return;
				}

				addId(input.dataset.command);

				await save()
			}
		})
}