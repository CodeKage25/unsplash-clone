<template>
    <div class="landing-page">
      <!-- Header with Search Bar -->
      <div class="header">
        <div v-if="!hasSearched" class="search-bar-container">
          <div class="search-bar">
            <input
              type="text"
              v-model="query"
              placeholder="Search for photo"
              @keyup.enter="searchImages"
            />
          </div>
        </div>

        <!-- Display Search Query -->
    <div class="search-query-text" v-else>
      Search Results for "{{ query }}"
    </div>
      </div>
  
      <!-- Skeleton Loading Placeholders -->
      <div v-if="isLoading" class="skeleton-flex">
        <div class="skeleton-container">
      <div v-for="n in 9" :key="n" class="skeleton-card"></div>
    </div>
      </div>
  
      <!-- Error Handling -->
      <div v-else-if="error" class="error-message">
        <!-- {{ error }} -->
        <p>Type any word to get image</p>
      </div>
  
      <!-- Image Grid -->
      <div v-else class="image-flex">
        <div class="image-grid">
          <div
            v-for="image in images"
            :key="image.id"
            class="image-card"
            @click="openModal(image)"
          >
            <img :src="image.urls.small" :alt="image.alt_description" class="image" />
            <div class="image-details">
              <p class="image-title">{{ image.user.name }}</p>
              <p class="image-location">{{ image.user.location || 'Unknown location' }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal for Image -->
      <div v-if="selectedImage" class="image-modal">
      <div class="modal-content">
        <img
          :src="selectedImage.urls.regular"
          :alt="selectedImage.alt_description"
          class="modal-image"
        />
        <div class="modal-details">
          <p class="modal-name">{{ selectedImage.user.name }}</p>
          <p class="modal-location">{{ selectedImage.user.location || 'Unknown location' }}</p>
        </div>
        <button class="modal-close" @click="closeModal">×</button>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import unsplashClient from '@/api/unsplash';
  import _ from 'lodash';
  
  export default {
    data() {
      return {
        images: [],
        query: '',
        isLoading: true,
        error: null,
        selectedImage: null,
        isFullImageLoading: false,
        hasSearched: false,
      };
    },
    methods: {
      fetchImages() {
    this.isLoading = true;
    this.error = null;

    const fetchImagesPromise = unsplashClient
      .get('/search/photos', { params: { query: this.query, per_page: 9 } })
      .then((response) => {
        this.images = response.data.results;
        this.hasSearched = true;
      })
      .catch(() => {
        this.error = 'Failed to fetch images. Please try again.';
      });
    const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 5000));

    Promise.all([fetchImagesPromise, minimumLoadingTime]).finally(() => {
      this.isLoading = false;
    });
  },
      debounceSearch: _.debounce(function () {
        this.fetchImages();
      }, 500),
      searchImages() {
        this.debounceSearch();
      },
      openModal(image) {
        this.selectedImage = image;
        this.isFullImageLoading = true;
      },
      closeModal() {
    this.selectedImage = null;
  },
    },
    mounted() {
      this.fetchImages();
    },
  };
  </script>
  
  <style scoped>
  :root {
    --primary-color: #333;
    --overlay-color: rgba(0, 0, 0, 0.4);
    --font-color: white;
    --secondary-color: #f0f0f0;
    --header-background: #e0e5f0;
  }
  
  .landing-page {
    background-color: #fff;
  }
  
  .header {
    background-color: var(--header-background);
    position: relative;
    padding: 40px 0;
    z-index: 1;
    width: 100%;
    background-color: #e0e5f0;
  }

  .search-query-text {
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
  
  /* Search Bar Styling */
  .search-bar-container {
    display: flex;
    justify-content: center;
    z-index: 2;
  }
  
  .search-bar {
    width: 100%;
    max-width: 1000px;
    position: relative;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 12px 20px;
    z-index: 2;
  }
  
  .search-bar input {
    width: 100%;
    padding: 14px 20px;
    font-size: 18px;
    border: none;
    border-radius: 20px;
    outline: none;
    z-index: 2;
  }
  
  .search-bar input::placeholder {
    color: #a1a1a1;
    font-size: 16px;
    z-index: 2;
  }
  
  /* Image Grid Styling */
  .image-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -40px; 
    z-index: 0;
    z-index: 2;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
  }
  
  .image-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
    height: 350px;
    width: 300px;
    transition: transform 0.3s ease;
  }
  
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .image-card:hover .image {
    transform: scale(1.05);
  }
  
  .image-details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px;
    text-align: left;
    font-size: 14px;
  }

  .image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
}

.modal-details {
  padding: 16px;
  background-color: #f4f4f4;
  text-align: left;
}

.modal-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.modal-location {
  font-size: 18px;
  color: #555;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.modal-close:hover {
  color: #ff0000;
}

.error-message {
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
}

  
  /* Loading Spinner */
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 50px auto;
  }
  
  /* Skeleton Loader Styling */

  .skeleton-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -40px;
    z-index: 0;
    z-index: 2; 
  }
.skeleton-container {
  display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
}

.skeleton-card {
  width: 300px;
  height: 350px;
  background-color: #e0e0e0;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}


  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .image-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  
    .search-bar {
      max-width: 100%;
    }
  }
  </style>
  