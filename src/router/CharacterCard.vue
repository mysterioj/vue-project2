<template>
    <div id="app">
      <header>
        <h1>Rick and Morty Characters</h1>
      </header>
      <main>
        <div class="cards">
          <div class="card" v-for="character in filteredCharacters" :key="character.id">
            <h2>{{ character.name }}</h2>
            <p>Status: {{ character.status }}</p>
            <p>Species: {{ character.species }}</p>
            <p>Gender: {{ character.gender }}</p>
            <p>Location: {{ character.location.name }}</p>
          </div>
        </div>
      </main>
      <footer>
        <div class="pagination">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </div>
        <div class="filters">
          <input type="text" v-model="filters.name" placeholder="Filter by name">
          <select v-model="filters.status">
            <option value="">All statuses</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="Unknown">Unknown</option>
          </select>
          <button @click="applyFilters">Apply</button>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        characters: [],
        currentPage: 1,
        totalPages: 0,
        filters: {
          name: '',
          status: ''
        }
      };
    },
    async created() {
      await this.fetchCharacters();
    },
    computed: {
      filteredCharacters() {
        let filtered = this.characters;
  
        if (this.filters.name) {
          filtered = filtered.filter(character =>
            character.name.toLowerCase().includes(this.filters.name.toLowerCase())
          );
        }
  
        if (this.filters.status) {
          filtered = filtered.filter(character =>
            character.status.toLowerCase() === this.filters.status.toLowerCase()
          );
        }
  
        return filtered;
      }
    },
    methods: {
      async fetchCharacters() {
        try {
          const response = await fetch(`https://rickandmortyapi.com/api/character?page=${this.currentPage}`);
          if (!response.ok) {
            throw new Error('Failed to fetch characters');
          }
          const data = await response.json();
          this.characters = data.results;
          this.totalPages = data.info.pages;
        } catch (error) {
          console.error('Error fetching characters:', error.message);
        }
      },
      async changePage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
          this.currentPage = pageNumber;
          await this.fetchCharacters();
        }
      },
      async applyFilters() {
        await this.fetchCharacters();
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ваши стили здесь */
  </style>
  