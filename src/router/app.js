import { createApp, ref } from 'vue';

const app = createApp({
    setup() {
        const characters = ref([]);
        const currentPage = ref(1);
        const totalPages = ref(0);
        const filters = ref({ name: '', status: '' });

        const fetchCharacters = async () => {
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage.value}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch characters');
                }
                const data = await response.json();
                characters.value = data.results;
                totalPages.value = data.info.pages;
            } catch (error) {
                console.error('Error fetching characters:', error.message);
            }
        };

        const changePage = async (pageNumber) => {
            if (pageNumber >= 1 && pageNumber <= totalPages.value) {
                currentPage.value = pageNumber;
                await fetchCharacters();
            }
        };

        const applyFilters = async () => {
            await fetchCharacters();
        };

        return {
            characters,
            currentPage,
            totalPages,
            filters,
            fetchCharacters,
            changePage,
            applyFilters
        };
    }
});

app.component('CharacterCard', {
    props: {
        character: Object
    },
    template: `
        <div class="card">
            <h2>{{ character.name }}</h2>
            <p>Status: {{ character.status }}</p>
            <p>Species: {{ character.species }}</p>
            <p>Gender: {{ character.gender }}</p>
            <p>Location: {{ character.location.name }}</p>
        </div>
    `
});

app.component('Pagination', {
    props: {
        currentPage: Number,
        totalPages: Number
    },
    setup(props, { emit }) {
        const changePage = (pageNumber) => {
            emit('page-change', pageNumber);
        };

        return {
            changePage
        };
    },
    template: `
        <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </div>
    `
});

app.component('Filters', {
    setup(props, { emit }) {
        const name = ref('');
        const status = ref('');

        const applyFilters = () => {
            emit('filters-change', { name: name.value, status: status.value });
        };

        return {
            name,
            status,
            applyFilters
        };
    },
    template: `
        <div class="filters">
            <input type="text" v-model="name" placeholder="Filter by name">
            <select v-model="status">
                <option value="">All statuses</option>
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="Unknown">Unknown</option>
            </select>
            <button @click="applyFilters">Apply</button>
        </div>
    `
});

app.mount('#app');
