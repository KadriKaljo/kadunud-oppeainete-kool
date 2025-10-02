class TextAdventure {
    constructor() {
        this.currentRoom = 'entrance';
        this.inventory = [];
        this.gameState = {
            hasKey: false,
            libraryBookFound: false,
            potionMixed: false,
            dragonTalked: false,
            mapFound: false,
            finalExamTaken: false,
            gameCompleted: false
        };
        this.rooms = this.initializeRooms();
        this.items = this.initializeItems();
    }

    initializeRooms() {
        return {
            entrance: {
                name: "School Entrance Hall",
                description: "You stand before the grand entrance of the School of Forgotten Subjects. Ancient stone archways tower above you, carved with mysterious runes that seem to shimmer in the torchlight. A heavy wooden door with iron hinges leads deeper into the school.",
                exits: {
                    north: 'corridor',
                    east: 'library'
                },
                items: ['rusty_key'],
                characters: ['guard']
            },
            corridor: {
                name: "Main Corridor",
                description: "A long, dimly lit corridor stretches before you. Portraits of long-forgotten headmasters line the walls, their eyes seeming to follow your every move. Doors lead to various classrooms, and you can hear the faint sound of chanting from somewhere nearby.",
                exits: {
                    south: 'entrance',
                    west: 'alchemy_class',
                    north: 'headmaster_office',
                    east: 'astronomy_tower'
                },
                items: ['scroll'],
                characters: ['ghost_student']
            },
            library: {
                name: "Library of Lost Knowledge",
                description: "Towering bookshelves reach up into darkness, filled with ancient tomes and forgotten scrolls. Dust motes dance in shafts of light filtering through stained glass windows. A massive book lies open on a pedestal in the center.",
                exits: {
                    west: 'entrance'
                },
                items: ['ancient_book', 'magic_quill'],
                characters: ['librarian']
            },
            alchemy_class: {
                name: "Alchemy Laboratory",
                description: "Bubbling cauldrons and glowing vials fill this mystical laboratory. The air is thick with the scent of herbs and magical ingredients. A large blackboard shows complex formulas for forgotten potions.",
                exits: {
                    east: 'corridor'
                },
                items: ['potion_ingredients', 'crystal_vial'],
                characters: ['professor_mysterium'],
                locked: true
            },
            astronomy_tower: {
                name: "Astronomy Tower",
                description: "At the top of a spiral staircase, you find yourself in a circular room with windows on all sides. Ancient telescopes point toward the stars, and star charts cover every available surface. The night sky twinkles mysteriously above.",
                exits: {
                    west: 'corridor'
                },
                items: ['star_map', 'telescope'],
                characters: ['star_keeper']
            },
            headmaster_office: {
                name: "Headmaster's Office",
                description: "The office of the school's enigmatic headmaster is filled with magical artifacts and floating books. A large desk sits in the center, covered with important-looking documents. Behind it, a portrait of the founder watches solemnly.",
                exits: {
                    south: 'corridor'
                },
                items: ['diploma', 'master_key'],
                characters: ['headmaster'],
                requiresItem: 'ancient_book'
            },
            secret_chamber: {
                name: "Secret Chamber of Secrets",
                description: "Hidden beneath the school, this ancient chamber holds the deepest secrets of forgotten knowledge. Glowing crystals illuminate walls covered in the oldest magical texts. At the center stands an altar with a mysterious orb.",
                exits: {
                    up: 'headmaster_office'
                },
                items: ['orb_of_knowledge'],
                characters: ['ancient_dragon'],
                hidden: true
            }
        };
    }

    initializeItems() {
        return {
            rusty_key: {
                name: "Rusty Key",
                description: "An old iron key, worn by time but still functional. It might unlock something important.",
                canTake: true,
                use: "alchemy_class"
            },
            scroll: {
                name: "Ancient Scroll",
                description: "A yellowed parchment with mysterious writing. The text appears to be a map of the school's secret passages.",
                canTake: true
            },
            ancient_book: {
                name: "Book of Forgotten Lore",
                description: "A massive tome bound in dragon leather. Its pages contain the accumulated wisdom of centuries.",
                canTake: true,
                special: true
            },
            magic_quill: {
                name: "Enchanted Quill",
                description: "A golden quill that writes by itself when dipped in magical ink.",
                canTake: true
            },
            potion_ingredients: {
                name: "Rare Potion Ingredients",
                description: "A collection of mystical herbs and crystals needed for advanced alchemy.",
                canTake: true
            },
            crystal_vial: {
                name: "Crystal Vial",
                description: "A perfectly clear vial that seems to amplify magical properties.",
                canTake: true
            },
            star_map: {
                name: "Celestial Map",
                description: "A detailed chart showing the positions of mystical constellations.",
                canTake: true
            },
            telescope: {
                name: "Enchanted Telescope",
                description: "This telescope can see not just stars, but glimpses of the future.",
                canTake: false
            },
            diploma: {
                name: "Diploma of Forgotten Arts",
                description: "An official certificate proving mastery of the forgotten subjects.",
                canTake: true,
                victory: true
            },
            master_key: {
                name: "Master Key",
                description: "A ornate key that can open any door in the school.",
                canTake: true
            },
            orb_of_knowledge: {
                name: "Orb of Infinite Knowledge",
                description: "A mystical orb containing all the forgotten knowledge of the ages.",
                canTake: true,
                ultimate: true
            }
        };
    }

    getCurrentRoom() {
        return this.rooms[this.currentRoom];
    }

    look(target = null) {
        const room = this.getCurrentRoom();

        if (!target) {
            let description = `**${room.name}**\n\n${room.description}`;

            if (room.items && room.items.length > 0) {
                const visibleItems = room.items.filter(itemId => this.items[itemId]);
                if (visibleItems.length > 0) {
                    description += "\n\nYou can see: " + visibleItems.map(itemId => this.items[itemId].name).join(", ");
                }
            }

            if (room.characters && room.characters.length > 0) {
                description += "\n\nPresent here: " + room.characters.join(", ").replace(/_/g, " ");
            }

            const exits = Object.keys(room.exits);
            if (exits.length > 0) {
                description += "\n\nExits: " + exits.join(", ");
            }

            return description;
        } else {
            return this.examineItem(target);
        }
    }

    move(direction) {
        const room = this.getCurrentRoom();

        if (!room.exits[direction]) {
            return "You cannot go that way.";
        }

        const nextRoomId = room.exits[direction];
        const nextRoom = this.rooms[nextRoomId];

        if (nextRoom.locked && !this.inventory.includes('rusty_key') && !this.inventory.includes('master_key')) {
            return "The door is locked. You need a key to enter.";
        }

        if (nextRoom.requiresItem && !this.inventory.includes(nextRoom.requiresItem)) {
            return `You need the ${this.items[nextRoom.requiresItem].name} to enter this room.`;
        }

        if (nextRoom.hidden && !this.gameState.mapFound) {
            return "You sense there might be something here, but cannot find the way.";
        }

        this.currentRoom = nextRoomId;

        if (nextRoomId === 'secret_chamber') {
            this.gameState.mapFound = true;
        }

        return this.look();
    }

    take(itemName) {
        const room = this.getCurrentRoom();
        const itemId = this.findItemByName(itemName, room.items);

        if (!itemId) {
            return "You don't see that here.";
        }

        const item = this.items[itemId];

        if (!item.canTake) {
            return `You cannot take the ${item.name}.`;
        }

        this.inventory.push(itemId);
        room.items = room.items.filter(id => id !== itemId);

        if (itemId === 'ancient_book') {
            this.gameState.libraryBookFound = true;
        }

        return `You take the ${item.name}.`;
    }

    use(itemName, target = null) {
        const itemId = this.findItemByName(itemName, this.inventory);

        if (!itemId) {
            return "You don't have that item.";
        }

        const item = this.items[itemId];

        if (itemId === 'rusty_key' && this.currentRoom === 'entrance') {
            const alchemyRoom = this.rooms['alchemy_class'];
            alchemyRoom.locked = false;
            return "You use the rusty key. You hear a distant click - something has been unlocked.";
        }

        if (itemId === 'potion_ingredients' && itemId === 'crystal_vial' && this.currentRoom === 'alchemy_class') {
            this.gameState.potionMixed = true;
            return "You mix the potion ingredients in the crystal vial. The mixture glows with magical energy!";
        }

        if (itemId === 'ancient_book' && this.currentRoom === 'headmaster_office') {
            this.rooms['secret_chamber'].hidden = false;
            this.rooms['headmaster_office'].exits.down = 'secret_chamber';
            return "As you open the ancient book, a secret passage opens in the floor!";
        }

        return `You cannot use the ${item.name} here.`;
    }

    talk(characterName) {
        const room = this.getCurrentRoom();

        if (!room.characters || !room.characters.includes(characterName.replace(" ", "_"))) {
            return "There's no one here by that name.";
        }

        switch (characterName.replace(" ", "_")) {
            case 'guard':
                return "The guard nods solemnly. 'Welcome to the School of Forgotten Subjects, young one. Seek knowledge, but beware the dangers that lie within.'";

            case 'ghost_student':
                return "The ghostly student whispers: 'I've been here for centuries, still trying to pass my final exam. The library holds many secrets...'";

            case 'librarian':
                if (!this.gameState.libraryBookFound) {
                    return "The ancient librarian looks up from her work. 'Ah, a seeker of knowledge! Take the Book of Forgotten Lore - you'll need it to reach the headmaster.'";
                } else {
                    return "The librarian smiles knowingly. 'The book will serve you well. Knowledge is power, young scholar.'";
                }

            case 'professor_mysterium':
                return "Professor Mysterium adjusts his pointed hat. 'Ah, an alchemist in training! Mix the ingredients carefully - one wrong move and... well, let's just say we've lost students before.'";

            case 'star_keeper':
                return "The Star Keeper gazes through a telescope. 'The stars tell of great destiny. Your path leads to the deepest secrets of this school.'";

            case 'headmaster':
                if (this.inventory.includes('ancient_book')) {
                    return "The Headmaster's eyes light up. 'You have proven worthy! The book you carry holds the key to our greatest secret. Use it wisely.'";
                } else {
                    return "The Headmaster regards you seriously. 'You seek audience with me? First, prove your worth by finding the Book of Forgotten Lore.'";
                }

            case 'ancient_dragon':
                if (!this.gameState.dragonTalked) {
                    this.gameState.dragonTalked = true;
                    return "The ancient dragon opens one massive eye. 'So, another seeker reaches my chamber. Answer me this: What is the most powerful magic?' (Hint: try 'answer knowledge')";
                } else {
                    return "The dragon nods approvingly. 'You have learned much, young scholar. Take the orb - you have earned it.'";
                }

            default:
                return "They don't seem interested in talking right now.";
        }
    }

    answer(response) {
        if (this.currentRoom === 'secret_chamber' && this.gameState.dragonTalked && response.toLowerCase() === 'knowledge') {
            this.rooms['secret_chamber'].items.push('orb_of_knowledge');
            return "The dragon rumbles with approval. 'Correct! Knowledge is indeed the most powerful magic. The orb is yours.'";
        }
        return "No one is waiting for an answer right now.";
    }

    examineItem(itemName) {
        const itemId = this.findItemByName(itemName, [...this.inventory, ...this.getCurrentRoom().items]);

        if (!itemId) {
            return "You don't see that item.";
        }

        return this.items[itemId].description;
    }

    showInventory() {
        if (this.inventory.length === 0) {
            return "Your inventory is empty.";
        }

        return "You are carrying: " + this.inventory.map(itemId => this.items[itemId].name).join(", ");
    }

    findItemByName(name, itemList) {
        const normalizedName = name.toLowerCase().replace(/ /g, "_");
        return itemList.find(itemId => {
            const item = this.items[itemId];
            return item && (
                item.name.toLowerCase().includes(normalizedName) ||
                itemId.toLowerCase().includes(normalizedName)
            );
        });
    }

    checkWinCondition() {
        if (this.inventory.includes('diploma') && this.inventory.includes('orb_of_knowledge')) {
            this.gameState.gameCompleted = true;
            return "🎉 **CONGRATULATIONS!** 🎉\n\nYou have successfully graduated from the School of Forgotten Subjects! You possess both the Diploma of Forgotten Arts and the Orb of Infinite Knowledge. You are now a master of the forgotten arts!\n\nThe ancient magic flows through you as you step out into the world, ready to preserve and teach the knowledge that others have forgotten. Your adventure has come to a triumphant end!";
        }
        return null;
    }

    getHelp() {
        return `**Available Commands:**
• **look** - Examine your surroundings
• **look [item]** - Examine a specific item
• **go [direction]** - Move in a direction (north, south, east, west, up, down)
• **take [item]** - Pick up an item
• **use [item]** - Use an item
• **talk [character]** - Speak with someone
• **inventory** - Check what you're carrying
• **help** - Show this help message

**Objective:** Explore the School of Forgotten Subjects, gather knowledge and items, and prove yourself worthy of graduation!

**Tips:**
- Talk to everyone you meet - they often have valuable information
- Some doors are locked and require keys
- The ancient book is crucial for accessing the deepest secrets
- Read item descriptions carefully for clues`;
    }

    processCommand(input) {
        const parts = input.trim().toLowerCase().split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');

        switch (command) {
            case 'look':
            case 'l':
                return this.look(args || null);

            case 'go':
            case 'move':
            case 'north':
            case 'south':
            case 'east':
            case 'west':
            case 'up':
            case 'down':
                const direction = command === 'go' || command === 'move' ? args : command;
                return this.move(direction);

            case 'take':
            case 'get':
            case 'pick':
                return this.take(args);

            case 'use':
                return this.use(args);

            case 'talk':
            case 'speak':
                return this.talk(args);

            case 'answer':
                return this.answer(args);

            case 'inventory':
            case 'inv':
            case 'i':
                return this.showInventory();

            case 'examine':
            case 'exam':
            case 'x':
                return this.examineItem(args);

            case 'help':
            case 'h':
                return this.getHelp();

            default:
                return "I don't understand that command. Type 'help' for available commands.";
        }
    }
}

class AdventureInterface {
    constructor() {
        this.game = new TextAdventure();
        this.outputElement = null;
        this.inputElement = null;
        this.isGameActive = false;
    }

    initialize() {
        this.createGameInterface();
        this.startGame();
    }

    createGameInterface() {
        // kast kuhu mängu elemendid lähevad
        const gameContainer = document.createElement('div');
        gameContainer.className = 'text-adventure-container';
        gameContainer.innerHTML = `
            <div class="adventure-header">
                <h2>🏰 School of Forgotten Subjects - Text Adventure 🏰</h2>
                <button class="adventure-close-btn" onclick="adventureGame.closeGame()">✕</button>
            </div>
            <div class="adventure-output" id="adventure-output"></div>
            <div class="adventure-input-container">
                <input type="text" id="adventure-input" placeholder="Enter your command..." autocomplete="off">
                <button onclick="adventureGame.processInput()">Send</button>
            </div>
        `;

        // aitäh javascript
        const styles = `
            .text-adventure-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                height: 80%;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #8B4513;
                border-radius: 10px;
                color: #E6D7B8;
                font-family: 'Courier New', monospace;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                box-shadow: 0 0 30px rgba(139, 69, 19, 0.8);
            }

            .adventure-header {
                padding: 15px;
                background: linear-gradient(45deg, #8B4513, #A0522D);
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #654321;
            }

            .adventure-header h2 {
                margin: 0;
                color: #FFD700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                font-size: 1.2em;
            }

            .adventure-close-btn {
                background: #8B0000;
                color: white;
                border: none;
                padding: 5px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1.2em;
                font-weight: bold;
            }

            .adventure-close-btn:hover {
                background: #A00000;
            }

            .adventure-output {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.7);
                border: 1px solid #654321;
                margin: 10px;
                border-radius: 5px;
                white-space: pre-wrap;
                line-height: 1.4;
            }

            .adventure-input-container {
                padding: 15px;
                display: flex;
                gap: 10px;
                background: rgba(139, 69, 19, 0.3);
                border-radius: 0 0 8px 8px;
            }

            .adventure-input-container input {
                flex: 1;
                padding: 10px;
                border: 2px solid #8B4513;
                border-radius: 5px;
                background: rgba(0, 0, 0, 0.8);
                color: #E6D7B8;
                font-family: inherit;
                font-size: 14px;
            }

            .adventure-input-container input:focus {
                outline: none;
                border-color: #FFD700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
            }

            .adventure-input-container button {
                padding: 10px 20px;
                background: #8B4513;
                color: #FFD700;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .adventure-input-container button:hover {
                background: #A0522D;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }

            .adventure-output::-webkit-scrollbar {
                width: 8px;
            }

            .adventure-output::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
            }

            .adventure-output::-webkit-scrollbar-thumb {
                background: #8B4513;
                border-radius: 4px;
            }

            .adventure-output::-webkit-scrollbar-thumb:hover {
                background: #A0522D;
            }
        `;

        // styled lehele, aitäh javascript
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        //lisa lehele mängu kast
        document.body.appendChild(gameContainer);

        this.outputElement = document.getElementById('adventure-output');
        this.inputElement = document.getElementById('adventure-input');

        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processInput();
            }
        });
    }

    startGame() {
        this.isGameActive = true;
        this.addOutput("Welcome to the School of Forgotten Subjects!");
        this.addOutput("═══════════════════════════════════════");
        this.addOutput("");
        this.addOutput("You are a young scholar seeking to learn the ancient arts that have been forgotten by the modern world. This mystical school holds secrets beyond imagination...");
        this.addOutput("");
        this.addOutput("Type 'help' for available commands.");
        this.addOutput("");
        this.addOutput(this.game.look());
        this.inputElement.focus();
    }

    processInput() {
        if (!this.isGameActive) return;

        const input = this.inputElement.value.trim();
        if (!input) return;

        this.addOutput(`> ${input}`);
        this.inputElement.value = '';

        const response = this.game.processCommand(input);
        this.addOutput(response);

        // võitsime mängu, paneme kinni
        const winMessage = this.game.checkWinCondition();
        if (winMessage) {
            this.addOutput("");
            this.addOutput(winMessage);
            this.isGameActive = false;
        }

        this.inputElement.focus();
    }

    addOutput(text) {
        this.outputElement.textContent += text + '\n';
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    closeGame() {
        const container = document.querySelector('.text-adventure-container');
        if (container) {
            container.remove();
        }
    }
}

let adventureGame = null;

//mängu alustamiseks
function startTextAdventure() {
    if (adventureGame) {
        adventureGame.closeGame();
    }
    adventureGame = new AdventureInterface();
    adventureGame.initialize();
}