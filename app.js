document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    const itemsContainer = document.getElementById('items-container');
    const clearButton = document.getElementById('clear-btn');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const imageFile = document.getElementById('image').files[0];

        if (!imageFile) {
            alert("Por favor, selecciona una imagen.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageData = reader.result;

            const newItem = { name, price, image: imageData };
            
            try {
                const response = await fetch('http://localhost:4000/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newItem)
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const item = await response.json();
                displayItem(item);
            } catch (error) {
                console.error("Error al guardar el ítem:", error);
            }
        };

        reader.readAsDataURL(imageFile);
    });

    
    clearButton.addEventListener('click', () => {
        form.reset(); 
    });

    async function loadItems() {
        try {
            const response = await fetch('http://localhost:4000/items');
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            const items = await response.json();
            items.forEach(displayItem);
        } catch (error) {
            console.error("Error al cargar los ítems:", error);
        }
    }

    function displayItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button data-id="${item.id}">Eliminar</button>
        `;
        itemsContainer.appendChild(itemDiv);

        const deleteButton = itemDiv.querySelector('button');
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:4000/items/${item.id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                itemDiv.remove();
            } catch (error) {
                console.error("Error al eliminar el ítem:", error);
            }
        });
    }

    loadItems();
});
