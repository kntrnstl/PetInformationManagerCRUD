<template>
  <ion-page>

    <!-- ========================================
         HEADER
    ========================================= -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="modern-toolbar">
        <div class="header-content">

          <div class="brand-area">
            <div class="header-icon">
              <ion-icon :icon="pawOutline" />
            </div>

            <div class="brand-text">
              <p>YOUR PET COMPANION</p>
              <h1>My Pets</h1>
            </div>
          </div>

          <div class="header-decoration">
            <ion-icon :icon="paw" />
          </div>

        </div>
      </ion-toolbar>
    </ion-header>


    <!-- ========================================
         CONTENT
    ========================================= -->
    <ion-content
      ref="contentRef"
      :fullscreen="true"
      class="app-content"
    >
      <div class="page-container">

        <!-- ========================================
             HERO
        ========================================= -->
        <section class="hero-section">
          <p class="hero-eyebrow">
            PET INFORMATION MANAGER
          </p>

          <h2>
            Everything about your pets,
            <span>organized.</span>
          </h2>

          <p class="hero-description">
            Keep your pet records organized, searchable,
            and easy to manage in one place.
          </p>
        </section>


        <!-- ========================================
             QUICK ACTIONS
        ========================================= -->
        <section class="quick-actions">

          <!-- PET RECORDS CARD -->
          <div class="quick-card records-summary-card">

            <div class="quick-icon records-icon">
              <ion-icon :icon="paw" />
            </div>

            <div class="quick-card-info">
              <strong>
                {{ pets.length }}
              </strong>

              <span>
                {{
                  pets.length === 1
                    ? 'Pet Record'
                    : 'Pet Records'
                }}
              </span>
            </div>

          </div>


          <!-- ADD PET BUTTON -->
          <button
            type="button"
            class="quick-card add-pet-card"
            :class="{ 'add-pet-card-open': showForm }"
            @click="handleAddButton"
          >
            <div class="quick-icon add-icon">
              <ion-icon
                :icon="showForm && !editingId ? closeOutline : addOutline"
              />
            </div>

            <div class="quick-card-info add-info">
              <strong>
                {{
                  showForm && !editingId
                    ? 'Close Form'
                    : 'Add Pet'
                }}
              </strong>

              <span>
                {{
                  showForm && !editingId
                    ? 'Hide pet form'
                    : 'Create new record'
                }}
              </span>
            </div>

            <div class="quick-arrow">
              <ion-icon
                :icon="
                  showForm && !editingId
                    ? chevronUpOutline
                    : chevronForwardOutline
                "
              />
            </div>
          </button>

        </section>


        <!-- ========================================
             ADD / EDIT FORM
        ========================================= -->
        <transition name="form-drop">

          <section
            v-if="showForm"
            class="floating-form-card"
          >

            <!-- HANDLE -->
            <div class="form-handle">
              <span></span>
            </div>


            <!-- FORM HEADER -->
            <div class="section-heading">

              <div class="section-icon">
                <ion-icon
                  :icon="
                    editingId
                      ? createOutline
                      : addOutline
                  "
                />
              </div>

              <div class="section-heading-text">

                <p class="form-eyebrow">
                  {{
                    editingId
                      ? 'EDIT RECORD'
                      : 'NEW PET RECORD'
                  }}
                </p>

                <h3>
                  {{
                    editingId
                      ? 'Edit Pet Information'
                      : 'Add New Pet'
                  }}
                </h3>

                <p>
                  {{
                    editingId
                      ? 'Update your pet information below.'
                      : 'Complete the details to create a pet record.'
                  }}
                </p>

              </div>


              <button
                type="button"
                class="close-form-button"
                aria-label="Close form"
                @click="resetForm"
              >
                <ion-icon :icon="closeOutline" />
              </button>

            </div>


            <!-- ========================================
                 FORM GRID
            ========================================= -->
            <div class="form-grid">

              <!-- PET NAME -->
              <div class="field-group pet-name-field">

                <label>
                  Pet Name
                </label>

                <div class="input-wrapper">

                  <div class="input-icon-box">
                    <ion-icon :icon="pawOutline" />
                  </div>

                  <ion-input
                    v-model="form.name"
                    placeholder="e.g. Bruno"
                    class="modern-input"
                  />

                </div>
              </div>


              <!-- ANIMAL TYPE -->
              <div class="field-group animal-field">

                <label>
                  Animal Type
                </label>

                <button
                  id="animal-type-trigger"
                  type="button"
                  class="select-button"
                >
                  <div class="select-left">

                    <div
                      class="select-emoji"
                      :class="getAnimalClass(form.animalType)"
                    >
                      {{ getAnimalEmoji(form.animalType) }}
                    </div>

                    <span
                      :class="{
                        'select-placeholder': !form.animalType
                      }"
                    >
                      {{
                        form.animalType ||
                        'Select type'
                      }}
                    </span>

                  </div>

                  <ion-icon
                    :icon="chevronDownOutline"
                    class="dropdown-arrow"
                  />
                </button>


                <!-- ANIMAL POPOVER -->
                <ion-popover
                  trigger="animal-type-trigger"
                  trigger-action="click"
                  side="bottom"
                  alignment="center"
                  class="custom-popover"
                >
                  <ion-content class="dropdown-content">

                    <div class="dropdown-header">

                      <span class="dropdown-title">
                        Choose Animal Type
                      </span>

                      <span class="dropdown-subtitle">
                        What kind of pet do you have?
                      </span>

                    </div>


                    <ion-list lines="none">

                      <ion-item
                        v-for="animal in animalTypes"
                        :key="animal.value"
                        button
                        :detail="false"
                        class="dropdown-option"
                        :class="{
                          'dropdown-option-selected':
                            form.animalType === animal.value
                        }"
                        @click="selectAnimal(animal.value)"
                      >

                        <div
                          class="option-emoji"
                          :class="getAnimalClass(animal.value)"
                        >
                          {{ animal.emoji }}
                        </div>

                        <ion-label>

                          <h3 class="option-name">
                            {{ animal.label }}
                          </h3>

                          <p>
                            {{ animal.description }}
                          </p>

                        </ion-label>

                        <ion-icon
                          v-if="form.animalType === animal.value"
                          slot="end"
                          :icon="checkmarkCircle"
                          class="selected-check"
                        />

                      </ion-item>

                    </ion-list>

                  </ion-content>
                </ion-popover>

              </div>


              <!-- BREED -->
              <div class="field-group breed-field">

                <label>
                  Breed
                </label>

                <button
                  id="breed-trigger"
                  type="button"
                  class="select-button"
                  :disabled="!form.animalType"
                >

                  <div class="select-left">

                    <div class="breed-icon-box">
                      <ion-icon :icon="ribbonOutline" />
                    </div>

                    <span
                      :class="{
                        'select-placeholder': !form.breed
                      }"
                    >
                      {{
                        form.breed ||
                        (
                          form.animalType
                            ? 'Select breed'
                            : 'Select type first'
                        )
                      }}
                    </span>

                  </div>

                  <ion-icon
                    :icon="chevronDownOutline"
                    class="dropdown-arrow"
                  />

                </button>


                <!-- BREED POPOVER -->
                <ion-popover
                  v-if="form.animalType"
                  trigger="breed-trigger"
                  trigger-action="click"
                  side="bottom"
                  alignment="center"
                  class="custom-popover"
                >
                  <ion-content class="dropdown-content">

                    <div class="dropdown-header">

                      <span class="dropdown-title">
                        Choose {{ form.animalType }} Breed
                      </span>

                      <span class="dropdown-subtitle">
                        Select the breed of your pet
                      </span>

                    </div>


                    <ion-list lines="none">

                      <ion-item
                        v-for="breed in availableBreeds"
                        :key="breed"
                        button
                        :detail="false"
                        class="dropdown-option breed-option"
                        :class="{
                          'dropdown-option-selected':
                            form.breed === breed
                        }"
                        @click="selectBreed(breed)"
                      >

                        <ion-label>
                          <h3 class="option-name">
                            {{ breed }}
                          </h3>
                        </ion-label>

                        <ion-icon
                          v-if="form.breed === breed"
                          slot="end"
                          :icon="checkmarkCircle"
                          class="selected-check"
                        />

                      </ion-item>

                    </ion-list>

                  </ion-content>
                </ion-popover>

              </div>


              <!-- AGE -->
              <div class="field-group age-field">

                <label>
                  Age
                </label>

                <div class="input-wrapper">

                  <div class="input-icon-box">
                    <ion-icon :icon="calendarOutline" />
                  </div>

                  <ion-input
                    v-model="form.age"
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    class="modern-input"
                  />

                </div>
              </div>


              <!-- OWNER -->
              <div class="field-group full-width owner-field">

                <label>
                  Owner Name
                </label>

                <div class="input-wrapper">

                  <div class="input-icon-box">
                    <ion-icon :icon="personOutline" />
                  </div>

                  <ion-input
                    v-model="form.ownerName"
                    placeholder="Owner name"
                    class="modern-input"
                  />

                </div>
              </div>


              <!-- NOTES -->
              <div class="field-group full-width notes-field">

                <label>
                  Notes

                  <span>
                    Optional
                  </span>
                </label>

                <div class="textarea-wrapper">

                  <div class="textarea-icon-box">
                    <ion-icon :icon="documentTextOutline" />
                  </div>

                  <ion-textarea
                    v-model="form.notes"
                    placeholder="Add notes about your pet..."
                    :auto-grow="true"
                    :rows="2"
                    class="modern-textarea"
                  />

                </div>
              </div>

            </div>


            <!-- FORM ACTIONS -->
            <div class="form-actions">

              <ion-button
                expand="block"
                class="save-button"
                @click="savePet"
              >

                <ion-icon
                  slot="start"
                  :icon="
                    editingId
                      ? saveOutline
                      : addCircleOutline
                  "
                />

                {{
                  editingId
                    ? 'Save Changes'
                    : 'Add Pet'
                }}

              </ion-button>


              <ion-button
                expand="block"
                fill="clear"
                class="cancel-button"
                @click="resetForm"
              >
                Cancel
              </ion-button>

            </div>

          </section>

        </transition>


        <!-- ========================================
             RECORDS TITLE
        ========================================= -->
        <section class="records-header">

          <div>

            <p class="records-label">
              YOUR PETS
            </p>

            <h3>
              Pet Records
            </h3>

            <p class="records-subtitle">
              Browse, search and manage your pets.
            </p>

          </div>


          <div class="records-tools">

            <button
              v-if="pets.length > 0"
              type="button"
              class="sort-button"
              @click="openSortMenu"
            >
              <ion-icon :icon="swapVerticalOutline" />

              <span>
                {{ activeSortLabel }}
              </span>
            </button>

            <div class="records-count">
              {{ filteredPets.length }}
            </div>

          </div>

        </section>


        <!-- ========================================
             SEARCH / FILTER
        ========================================= -->
        <section
          v-if="pets.length > 0"
          class="search-filter-card"
        >

          <!-- SEARCH -->
          <div class="search-wrapper">

            <ion-icon
              :icon="searchOutline"
              class="search-icon"
            />

            <ion-input
              v-model="searchTerm"
              class="search-input"
              placeholder="Search pet, owner, or breed..."
              :clear-input="true"
            />

          </div>


          <!-- FILTER HEADER -->
          <div class="filter-title-area">

            <span class="filter-small-label">
              FILTER BY ANIMAL
            </span>

            <button
              v-if="
                searchTerm ||
                activeFilter !== 'All'
              "
              type="button"
              class="clear-filter-button"
              @click="clearFilters"
            >
              Clear
            </button>

          </div>


          <!-- FILTER CHIPS -->
          <div class="filter-scroll">

            <button
              v-for="filter in filterOptions"
              :key="filter"
              type="button"
              class="filter-chip"
              :class="{
                active: activeFilter === filter
              }"
              @click="activeFilter = filter"
            >

              <span class="filter-emoji">
                {{
                  filter === 'All'
                    ? '🐾'
                    : getAnimalEmoji(filter)
                }}
              </span>

              <span>
                {{ filter }}
              </span>

            </button>

          </div>

        </section>


        <!-- ========================================
             LOADING
        ========================================= -->
        <div
          v-if="loading"
          class="state-card"
        >

          <div class="state-icon">
            <ion-spinner name="crescent" />
          </div>

          <h4>
            Loading pets
          </h4>

          <p>
            Fetching your pet records...
          </p>

        </div>


        <!-- ========================================
             EMPTY
        ========================================= -->
        <div
          v-else-if="pets.length === 0"
          class="state-card"
        >

          <div class="state-icon">
            <ion-icon :icon="pawOutline" />
          </div>

          <h4>
            No pets yet
          </h4>

          <p>
            Add your first pet and start building your pet records.
          </p>

          <ion-button
            fill="clear"
            class="empty-button"
            @click="openAddForm"
          >

            <ion-icon
              slot="start"
              :icon="addCircleOutline"
            />

            Add First Pet

          </ion-button>

        </div>


        <!-- ========================================
             NO RESULTS
        ========================================= -->
        <div
          v-else-if="filteredPets.length === 0"
          class="state-card"
        >

          <div class="state-icon">
            <ion-icon :icon="searchOutline" />
          </div>

          <h4>
            No matching pets
          </h4>

          <p>
            Try another keyword or choose another animal category.
          </p>

          <ion-button
            fill="clear"
            class="empty-button"
            @click="clearFilters"
          >
            Clear Filters
          </ion-button>

        </div>


        <!-- ========================================
             PET CARDS
        ========================================= -->
        <div
          v-else
          class="pets-grid"
        >

          <article
            v-for="pet in filteredPets"
            :key="pet.id"
            class="pet-card"
            :class="getPetCardClass(pet.animalType)"
            role="button"
            tabindex="0"
            @click="openPetDetails(pet)"
            @keydown.enter="openPetDetails(pet)"
          >

            <!-- TOP -->
            <div class="pet-card-top">

              <div
                class="pet-avatar"
                :class="getAnimalClass(pet.animalType)"
              >
                {{ getAnimalEmoji(pet.animalType) }}
              </div>


              <div class="pet-main-info">

                <h4>
                  {{ pet.name }}
                </h4>

                <div class="pet-type">

                  <span>
                    {{ pet.animalType }}
                  </span>

                  <span class="dot">
                    •
                  </span>

                  <span>
                    {{ pet.breed }}
                  </span>

                </div>

              </div>


              <div class="age-badge">

                <strong>
                  {{ pet.age }}
                </strong>

                <span>
                  {{
                    pet.age === 1
                      ? 'year'
                      : 'years'
                  }}
                </span>

              </div>

            </div>


            <!-- DETAILS -->
            <div class="pet-details">

              <div class="detail-row">

                <div class="detail-icon">
                  <ion-icon :icon="personOutline" />
                </div>

                <div class="detail-content">

                  <span class="detail-label">
                    OWNER
                  </span>

                  <strong>
                    {{ pet.ownerName }}
                  </strong>

                </div>

              </div>


              <div class="detail-row">

                <div class="detail-icon">
                  <ion-icon :icon="documentTextOutline" />
                </div>

                <div class="detail-content">

                  <span class="detail-label">
                    NOTES
                  </span>

                  <strong class="notes-text">
                    {{
                      pet.notes ||
                      'No notes provided'
                    }}
                  </strong>

                </div>

              </div>

            </div>


            <div class="view-details-hint">
              <div>
                <ion-icon :icon="eyeOutline" />
                <span>Tap card to view details</span>
              </div>

              <ion-icon
                :icon="chevronForwardOutline"
                class="view-details-arrow"
              />
            </div>


            <!-- ACTIONS -->
            <div class="pet-actions">

              <ion-button
                fill="clear"
                class="edit-button"
                @click.stop="editPet(pet)"
              >

                <ion-icon
                  slot="start"
                  :icon="createOutline"
                />

                Edit

              </ion-button>


              <ion-button
                fill="clear"
                class="delete-button"
                @click.stop="confirmDelete(pet)"
              >

                <ion-icon
                  slot="start"
                  :icon="trashOutline"
                />

                Delete

              </ion-button>

            </div>

          </article>

        </div>


        <div class="bottom-space"></div>

      </div>
    </ion-content>


    <!-- ========================================
         PET DETAILS BOTTOM SHEET
    ========================================= -->
    <transition name="sheet-fade">

      <div
        v-if="petDetailsOpen && selectedPet"
        class="sheet-backdrop"
        @click.self="closePetDetails"
      >

        <section
          class="details-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Pet details"
        >

          <div class="sheet-handle">
            <span></span>
          </div>

          <button
            type="button"
            class="sheet-close-button"
            aria-label="Close pet details"
            @click="closePetDetails"
          >
            <ion-icon :icon="closeOutline" />
          </button>

          <div class="details-hero">

            <div
              class="details-avatar"
              :class="getAnimalClass(selectedPet.animalType)"
            >
              {{ getAnimalEmoji(selectedPet.animalType) }}
            </div>

            <div class="details-title">
              <p>PET PROFILE</p>

              <h3>
                {{ selectedPet.name }}
              </h3>

              <span>
                {{ selectedPet.animalType }}
                •
                {{ selectedPet.breed }}
              </span>
            </div>

            <div class="details-age">
              <strong>
                {{ selectedPet.age }}
              </strong>

              <span>
                {{
                  selectedPet.age === 1
                    ? 'year old'
                    : 'years old'
                }}
              </span>
            </div>

          </div>

          <div class="details-info-grid">

            <div class="details-info-card">
              <div class="details-info-icon">
                <ion-icon :icon="pawOutline" />
              </div>

              <span>Animal Type</span>

              <strong>
                {{ selectedPet.animalType }}
              </strong>
            </div>

            <div class="details-info-card">
              <div class="details-info-icon">
                <ion-icon :icon="ribbonOutline" />
              </div>

              <span>Breed</span>

              <strong>
                {{ selectedPet.breed }}
              </strong>
            </div>

            <div class="details-info-card">
              <div class="details-info-icon">
                <ion-icon :icon="personOutline" />
              </div>

              <span>Owner</span>

              <strong>
                {{ selectedPet.ownerName }}
              </strong>
            </div>

            <div class="details-info-card">
              <div class="details-info-icon">
                <ion-icon :icon="calendarOutline" />
              </div>

              <span>Age</span>

              <strong>
                {{ selectedPet.age }}
                {{
                  selectedPet.age === 1
                    ? 'year'
                    : 'years'
                }}
              </strong>
            </div>

          </div>

          <div class="details-notes-card">

            <div class="details-notes-heading">
              <div class="details-info-icon">
                <ion-icon :icon="documentTextOutline" />
              </div>

              <div>
                <span>NOTES</span>
                <strong>Pet information</strong>
              </div>
            </div>

            <p>
              {{
                selectedPet.notes ||
                'No notes provided for this pet.'
              }}
            </p>

          </div>

          <div class="details-actions">

            <button
              type="button"
              class="details-edit-button"
              @click="editFromDetails"
            >
              <ion-icon :icon="createOutline" />
              Edit Pet
            </button>

            <button
              type="button"
              class="details-delete-button"
              @click="deleteFromDetails"
            >
              <ion-icon :icon="trashOutline" />
              Delete
            </button>

          </div>

        </section>

      </div>

    </transition>


    <!-- ========================================
         SORT PETS BOTTOM SHEET
    ========================================= -->
    <transition name="sheet-fade">

      <div
        v-if="sortMenuOpen"
        class="sheet-backdrop"
        @click.self="closeSortMenu"
      >

        <section
          class="sort-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Sort pet records"
        >

          <div class="sheet-handle">
            <span></span>
          </div>

          <div class="sort-sheet-header">

            <div class="sort-heading-icon">
              <ion-icon :icon="swapVerticalOutline" />
            </div>

            <div>
              <p>PET RECORDS</p>
              <h3>Sort Pets</h3>
              <span>Choose how your records are arranged.</span>
            </div>

            <button
              type="button"
              class="sheet-close-button sort-close-button"
              aria-label="Close sort menu"
              @click="closeSortMenu"
            >
              <ion-icon :icon="closeOutline" />
            </button>

          </div>

          <div class="sort-options">

            <button
              v-for="option in sortOptions"
              :key="option.value"
              type="button"
              class="sort-option"
              :class="{
                'sort-option-active':
                  sortMode === option.value
              }"
              @click="selectSort(option.value)"
            >

              <div>
                <strong>
                  {{ option.label }}
                </strong>

                <span>
                  {{ option.description }}
                </span>
              </div>

              <ion-icon
                v-if="sortMode === option.value"
                :icon="checkmarkCircle"
                class="sort-check"
              />

            </button>

          </div>

        </section>

      </div>

    </transition>


    <!-- ========================================
         CUSTOM TOAST
    ========================================= -->
    <transition name="toast-pop">

      <div
        v-if="appToast.show"
        class="app-toast"
        :class="`toast-${appToast.type}`"
        role="status"
        aria-live="polite"
      >

        <div class="toast-status-icon">
          <ion-icon :icon="toastIcon" />
        </div>


        <div class="toast-content">

          <strong>
            {{ toastTitle }}
          </strong>

          <span>
            {{ appToast.message }}
          </span>

        </div>


        <button
          type="button"
          class="toast-close"
          aria-label="Close notification"
          @click="closeToast"
        >
          <ion-icon :icon="closeOutline" />
        </button>

      </div>

    </transition>


    <!-- ========================================
         CUSTOM DELETE DIALOG
    ========================================= -->
    <transition name="dialog-fade">

      <div
        v-if="deleteAlertOpen"
        class="dialog-backdrop"
        @click.self="cancelDelete"
      >

        <div
          class="delete-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >

          <div class="delete-dialog-icon">
            <ion-icon :icon="trashOutline" />
          </div>


          <h3 id="delete-title">
            Delete Pet?
          </h3>


          <p>
            Are you sure you want to delete

            <strong>
              {{ petToDelete?.name || 'this pet' }}
            </strong>?

            This action cannot be undone.
          </p>


          <div class="delete-dialog-actions">

            <button
              type="button"
              class="dialog-cancel-button"
              @click="cancelDelete"
            >
              Cancel
            </button>


            <button
              type="button"
              class="dialog-delete-button"
              @click="confirmDeleteAction"
            >
              <ion-icon :icon="trashOutline" />

              Delete Pet
            </button>

          </div>

        </div>

      </div>

    </transition>

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  popoverController
} from '@ionic/vue';


import {
  reactive,
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue';


import {
  ref as databaseRef,
  push,
  onValue,
  update,
  remove
} from 'firebase/database';


import {
  pawOutline,
  paw,
  addOutline,
  addCircleOutline,
  createOutline,
  trashOutline,
  personOutline,
  calendarOutline,
  documentTextOutline,
  ribbonOutline,
  saveOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  checkmarkCircle,
  closeOutline,
  searchOutline,
  warningOutline,
  alertCircleOutline,
  swapVerticalOutline,
  eyeOutline
} from 'ionicons/icons';


import {
  db
} from '../firebase';



/* ========================================
   INTERFACES
========================================= */

interface Pet {
  id: string;
  name: string;
  animalType: string;
  breed: string;
  age: number;
  ownerName: string;
  notes: string;
}


interface AnimalType {
  label: string;
  value: string;
  emoji: string;
  description: string;
}


type ToastType =
  | 'success'
  | 'warning'
  | 'danger';



/* ========================================
   CONTENT REF
========================================= */

const contentRef =
  ref<InstanceType<typeof IonContent> | null>(
    null
  );



/* ========================================
   ANIMAL TYPES
========================================= */

const animalTypes: AnimalType[] = [

  {
    label: 'Dog',
    value: 'Dog',
    emoji: '🐶',
    description: 'Dogs and puppies'
  },

  {
    label: 'Cat',
    value: 'Cat',
    emoji: '🐱',
    description: 'Cats and kittens'
  },

  {
    label: 'Bird',
    value: 'Bird',
    emoji: '🐦',
    description: 'Pet birds'
  },

  {
    label: 'Rabbit',
    value: 'Rabbit',
    emoji: '🐰',
    description: 'Rabbits and bunnies'
  },

  {
    label: 'Fish',
    value: 'Fish',
    emoji: '🐟',
    description: 'Aquarium pets'
  },

  {
    label: 'Other',
    value: 'Other',
    emoji: '🐾',
    description: 'Other types of pets'
  }

];



/* ========================================
   BREED OPTIONS
========================================= */

const breedOptions:
  Record<string, string[]> = {

  Dog: [
    'Aspin',
    'Labrador Retriever',
    'Golden Retriever',
    'German Shepherd',
    'Shih Tzu',
    'Pomeranian',
    'Beagle',
    'Poodle',
    'Chihuahua',
    'Siberian Husky',
    'Bulldog',
    'Doberman',
    'Rottweiler',
    'Corgi',
    'Pug'
  ],

  Cat: [
    'Puspin',
    'Persian',
    'Siamese',
    'British Shorthair',
    'Maine Coon',
    'Ragdoll',
    'Bengal',
    'Scottish Fold',
    'Sphynx',
    'American Shorthair'
  ],

  Bird: [
    'Lovebird',
    'Parakeet',
    'Cockatiel',
    'Canary',
    'Finch',
    'Parrot',
    'African Grey',
    'Cockatoo',
    'Budgerigar'
  ],

  Rabbit: [
    'New Zealand',
    'Lionhead',
    'Holland Lop',
    'Mini Rex',
    'Netherland Dwarf',
    'Flemish Giant',
    'Angora',
    'Dutch Rabbit'
  ],

  Fish: [
    'Betta',
    'Goldfish',
    'Guppy',
    'Molly',
    'Platy',
    'Angelfish',
    'Tetra',
    'Koi',
    'Oscar',
    'Gourami'
  ],

  Other: [
    'Hamster',
    'Guinea Pig',
    'Turtle',
    'Snake',
    'Lizard',
    'Hedgehog',
    'Ferret',
    'Other'
  ]

};



/* ========================================
   VARIABLES
========================================= */

const pets =
  ref<Pet[]>([]);


const loading =
  ref(true);


const editingId =
  ref<string | null>(null);


const showForm =
  ref(false);


const deleteAlertOpen =
  ref(false);


const petToDelete =
  ref<Pet | null>(null);


const searchTerm =
  ref('');


const activeFilter =
  ref('All');


const sortMode =
  ref('default');


const sortMenuOpen =
  ref(false);


const selectedPet =
  ref<Pet | null>(null);


const petDetailsOpen =
  ref(false);


const filterOptions = [
  'All',
  'Dog',
  'Cat',
  'Bird',
  'Rabbit',
  'Fish',
  'Other'
];


const sortOptions = [
  {
    value: 'default',
    label: 'Default',
    shortLabel: 'Sort',
    description: 'Keep the original record order'
  },
  {
    value: 'name-asc',
    label: 'Name A–Z',
    shortLabel: 'A–Z',
    description: 'Arrange pets alphabetically'
  },
  {
    value: 'name-desc',
    label: 'Name Z–A',
    shortLabel: 'Z–A',
    description: 'Reverse alphabetical order'
  },
  {
    value: 'age-asc',
    label: 'Youngest First',
    shortLabel: 'Youngest',
    description: 'Show younger pets first'
  },
  {
    value: 'age-desc',
    label: 'Oldest First',
    shortLabel: 'Oldest',
    description: 'Show older pets first'
  },
  {
    value: 'animal',
    label: 'Animal Type',
    shortLabel: 'Type',
    description: 'Group records by animal type'
  }
];



/* ========================================
   FORM
========================================= */

const form = reactive({

  name: '',

  animalType: '',

  breed: '',

  age: '',

  ownerName: '',

  notes: ''

});



/* ========================================
   CUSTOM TOAST
========================================= */

const appToast = reactive({
  show: false,
  message: '',
  type: 'success' as ToastType
});


let toastTimer:
  ReturnType<typeof setTimeout>
  | null =
  null;


const toastTitle =
  computed(() => {

    if (
      appToast.type ===
      'warning'
    ) {
      return 'Check Information';
    }


    if (
      appToast.type ===
      'danger'
    ) {
      return 'Something Went Wrong';
    }


    return 'Success';

  });


const toastIcon =
  computed(() => {

    if (
      appToast.type ===
      'warning'
    ) {
      return warningOutline;
    }


    if (
      appToast.type ===
      'danger'
    ) {
      return alertCircleOutline;
    }


    return checkmarkCircle;

  });


const closeToast = () => {

  appToast.show =
    false;


  if (
    toastTimer
  ) {

    clearTimeout(
      toastTimer
    );


    toastTimer =
      null;

  }

};


const showToast = async (

  message: string,

  type: string = 'success'

) => {

  if (
    toastTimer
  ) {

    clearTimeout(
      toastTimer
    );

  }


  appToast.message =
    message;


  appToast.type =

    type === 'warning'

      ? 'warning'

      : type === 'danger'

        ? 'danger'

        : 'success';


  appToast.show =
    true;


  toastTimer =
    setTimeout(
      () => {

        appToast.show =
          false;


        toastTimer =
          null;

      },

      2700
    );

};



/* ========================================
   AVAILABLE BREEDS
========================================= */

const availableBreeds =
  computed(() => {

    if (
      !form.animalType
    ) {
      return [];
    }


    return (
      breedOptions[
        form.animalType
      ] || []
    );

  });



/* ========================================
   FILTER PETS
========================================= */

const filteredPets =
  computed(() => {

    const query =
      searchTerm.value
        .trim()
        .toLowerCase();


    const result =
      pets.value.filter(
        (pet) => {

          const animalMatches =
            activeFilter.value === 'All'
            ||
            pet.animalType === activeFilter.value;


          const searchableText = [
            pet.name,
            pet.ownerName,
            pet.animalType,
            pet.breed,
            pet.notes
          ]
            .join(' ')
            .toLowerCase();


          const searchMatches =
            !query
            ||
            searchableText.includes(query);


          return (
            animalMatches &&
            searchMatches
          );

        }
      );


    const sorted =
      [...result];


    switch (sortMode.value) {

      case 'name-asc':
        sorted.sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );
        break;

      case 'name-desc':
        sorted.sort(
          (a, b) =>
            b.name.localeCompare(a.name)
        );
        break;

      case 'age-asc':
        sorted.sort(
          (a, b) =>
            a.age - b.age
        );
        break;

      case 'age-desc':
        sorted.sort(
          (a, b) =>
            b.age - a.age
        );
        break;

      case 'animal':
        sorted.sort(
          (a, b) => {
            const byType =
              a.animalType.localeCompare(
                b.animalType
              );

            if (byType !== 0) {
              return byType;
            }

            return a.name.localeCompare(
              b.name
            );
          }
        );
        break;
    }


    return sorted;

  });


const activeSortLabel =
  computed(() => {
    return (
      sortOptions.find(
        (option) =>
          option.value === sortMode.value
      )?.shortLabel
      ||
      'Sort'
    );
  });


const openSortMenu = () => {
  sortMenuOpen.value = true;
};


const closeSortMenu = () => {
  sortMenuOpen.value = false;
};


const selectSort = (
  value: string
) => {
  sortMode.value = value;
  sortMenuOpen.value = false;
};



/* ========================================
   CLEAR FILTERS
========================================= */

const clearFilters = () => {

  searchTerm.value =
    '';


  activeFilter.value =
    'All';

};



/* ========================================
   ANIMAL EMOJI
========================================= */

const getAnimalEmoji = (

  animalType: string

) => {

  switch (
    animalType
      ?.toLowerCase()
  ) {

    case 'dog':
      return '🐶';

    case 'cat':
      return '🐱';

    case 'bird':
      return '🐦';

    case 'rabbit':
      return '🐰';

    case 'fish':
      return '🐟';

    default:
      return '🐾';

  }

};



/* ========================================
   ANIMAL CLASS
========================================= */

const getAnimalClass = (

  animalType: string

) => {

  if (
    !animalType
  ) {
    return 'animal-other';
  }


  return (
    `animal-${animalType.toLowerCase()}`
  );

};



/* ========================================
   PET CARD CLASS
========================================= */

const getPetCardClass = (

  animalType: string

) => {

  if (
    !animalType
  ) {
    return 'pet-card-other';
  }


  return (
    `pet-card-${animalType.toLowerCase()}`
  );

};



/* ========================================
   SELECT ANIMAL
========================================= */

const selectAnimal = async (

  animalType: string

) => {

  if (
    form.animalType !==
    animalType
  ) {

    form.breed =
      '';

  }


  form.animalType =
    animalType;


  await popoverController.dismiss();

};



/* ========================================
   SELECT BREED
========================================= */

const selectBreed = async (

  breed: string

) => {

  form.breed =
    breed;


  await popoverController.dismiss();

};



/* ========================================
   CLEAR FORM
========================================= */

const clearFormFields = () => {

  form.name =
    '';

  form.animalType =
    '';

  form.breed =
    '';

  form.age =
    '';

  form.ownerName =
    '';

  form.notes =
    '';

};



/* ========================================
   ADD BUTTON
========================================= */

const handleAddButton = async () => {

  if (
    showForm.value &&
    !editingId.value
  ) {

    resetForm();

    return;

  }


  await openAddForm();

};



/* ========================================
   OPEN ADD FORM
========================================= */

const openAddForm = async () => {

  editingId.value =
    null;


  clearFormFields();


  showForm.value =
    true;


  await nextTick();


  await contentRef.value
    ?.$el
    .scrollToTop(
      300
    );

};



/* ========================================
   READ FIREBASE
========================================= */

let unsubscribe:
  (() => void) | null =
  null;


onMounted(() => {

  const petsRef =
    databaseRef(
      db,
      'pets'
    );


  unsubscribe =
    onValue(

      petsRef,


      (snapshot) => {

        const data =
          snapshot.val();


        if (
          data
        ) {

          pets.value =

            Object
              .keys(data)
              .map(

                (key) => ({

                  id:
                    key,


                  name:

                    data[key]
                      .name

                    || '',


                  animalType:

                    data[key]
                      .animalType

                    || '',


                  breed:

                    data[key]
                      .breed

                    || '',


                  age:

                    Number(
                      data[key]
                        .age
                    )

                    || 0,


                  ownerName:

                    data[key]
                      .ownerName

                    || '',


                  notes:

                    data[key]
                      .notes

                    || ''

                })

              );

        }

        else {

          pets.value =
            [];

        }


        loading.value =
          false;

      },


      async (error) => {

        console.error(
          'Firebase read error:',
          error
        );


        loading.value =
          false;


        await showToast(
          'Unable to load pet records.',
          'danger'
        );

      }

    );

});



/* ========================================
   CLEANUP
========================================= */

onUnmounted(() => {

  if (
    unsubscribe
  ) {

    unsubscribe();

  }


  if (
    toastTimer
  ) {

    clearTimeout(
      toastTimer
    );

  }

});



/* ========================================
   SAVE PET
========================================= */

const savePet =
  async () => {


    if (
      !form.name.trim()
    ) {

      await showToast(
        'Please enter the pet name.',
        'warning'
      );

      return;

    }


    if (
      !form.animalType
    ) {

      await showToast(
        'Please select an animal type.',
        'warning'
      );

      return;

    }


    if (
      !form.breed
    ) {

      await showToast(
        'Please select a breed.',
        'warning'
      );

      return;

    }


    if (

      form.age === ''

      ||

      Number(
        form.age
      ) < 0

    ) {

      await showToast(
        'Please enter a valid age.',
        'warning'
      );

      return;

    }


    if (
      !form.ownerName.trim()
    ) {

      await showToast(
        'Please enter the owner name.',
        'warning'
      );

      return;

    }



    const petData = {

      name:
        form.name.trim(),


      animalType:
        form.animalType,


      breed:
        form.breed,


      age:
        Number(
          form.age
        ),


      ownerName:
        form.ownerName.trim(),


      notes:
        form.notes.trim()

    };



    try {


      /* UPDATE */
      if (
        editingId.value
      ) {

        const petRef =
          databaseRef(
            db,
            `pets/${editingId.value}`
          );


        await update(
          petRef,
          petData
        );


        await showToast(
          'Pet updated successfully!'
        );

      }


      /* CREATE */
      else {

        const petsRef =
          databaseRef(
            db,
            'pets'
          );


        await push(
          petsRef,
          petData
        );


        await showToast(
          'Pet added successfully!'
        );

      }


      resetForm();

    }


    catch (
      error
    ) {

      console.error(
        'Firebase save error:',
        error
      );


      await showToast(
        'Unable to save pet.',
        'danger'
      );

    }

  };



/* ========================================
   PET DETAILS
========================================= */

const openPetDetails = (
  pet: Pet
) => {
  selectedPet.value = pet;
  petDetailsOpen.value = true;
};


const closePetDetails = () => {
  petDetailsOpen.value = false;
};


const editFromDetails =
  async () => {

    if (!selectedPet.value) {
      return;
    }

    const pet =
      selectedPet.value;

    closePetDetails();

    await editPet(pet);

  };


const deleteFromDetails = () => {

  if (!selectedPet.value) {
    return;
  }

  const pet =
    selectedPet.value;

  closePetDetails();

  confirmDelete(pet);

};



/* ========================================
   EDIT PET
========================================= */

const editPet =
  async (
    pet: Pet
  ) => {


    editingId.value =
      pet.id;


    form.name =
      pet.name;


    form.animalType =
      pet.animalType;


    form.breed =
      pet.breed;


    form.age =
      String(
        pet.age
      );


    form.ownerName =
      pet.ownerName;


    form.notes =
      pet.notes;


    showForm.value =
      true;


    await nextTick();


    await contentRef.value
      ?.$el
      .scrollToTop(
        400
      );

  };



/* ========================================
   OPEN DELETE
========================================= */

const confirmDelete = (

  pet: Pet

) => {

  petToDelete.value =
    pet;


  deleteAlertOpen.value =
    true;

};



/* ========================================
   CANCEL DELETE
========================================= */

const cancelDelete = () => {

  deleteAlertOpen.value =
    false;


  petToDelete.value =
    null;

};



/* ========================================
   CONFIRM DELETE
========================================= */

const confirmDeleteAction =
  async () => {


    if (
      !petToDelete.value
    ) {

      return;

    }


    const id =
      petToDelete.value.id;


    deleteAlertOpen.value =
      false;


    await deletePet(
      id
    );

  };



/* ========================================
   DELETE PET
========================================= */

const deletePet =
  async (
    id: string
  ) => {


    try {


      const petRef =
        databaseRef(
          db,
          `pets/${id}`
        );


      await remove(
        petRef
      );


      petToDelete.value =
        null;


      await showToast(
        'Pet deleted successfully!'
      );

    }


    catch (
      error
    ) {


      console.error(
        'Firebase delete error:',
        error
      );


      await showToast(
        'Unable to delete pet.',
        'danger'
      );

    }

  };



/* ========================================
   RESET FORM
========================================= */

const resetForm = () => {

  editingId.value =
    null;


  clearFormFields();


  showForm.value =
    false;

};

</script>


<style scoped>

/* ========================================
   PAGE
========================================= */

.app-content {
  --background: #f6f7fb;
}


.page-container {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 18px 15px;
}


/* ========================================
   HEADER
========================================= */

.modern-toolbar {
  --background:
    linear-gradient(
      125deg,
      #4f46e5 0%,
      #6366f1 48%,
      #7c3aed 100%
    );

  --min-height: 75px;
}


.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding:
    calc(env(safe-area-inset-top) + 8px)
    18px
    10px;
}


.brand-area {
  display: flex;
  align-items: center;
  gap: 11px;
}


.header-icon {
  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(255, 255, 255, 0.20);

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.14);

  color: white;

  font-size: 23px;

  backdrop-filter: blur(10px);
}


.brand-text p {
  margin: 0 0 2px;

  color:
    rgba(255, 255, 255, 0.70);

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.3px;
}


.brand-text h1 {
  margin: 0;

  color: white;

  font-size: 20px;
  font-weight: 850;

  letter-spacing: -0.3px;
}


.header-decoration {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.11);

  color:
    rgba(255, 255, 255, 0.62);

  font-size: 17px;
}


/* ========================================
   HERO
========================================= */

.hero-section {
  padding: 6px 2px 0;
  margin-bottom: 19px;
}


.hero-eyebrow {
  margin: 0 0 6px;

  color: #6366f1;

  font-size: 9px;
  font-weight: 850;

  letter-spacing: 1.35px;
}


.hero-section h2 {
  max-width: 500px;

  margin: 0;

  color: #101522;

  font-size: 27px;
  font-weight: 850;

  line-height: 1.08;

  letter-spacing: -0.6px;
}


.hero-section h2 span {
  color: #6366f1;
}


.hero-description {
  max-width: 520px;

  margin: 9px 0 0;

  color: #777f90;

  font-size: 12px;

  line-height: 1.5;
}


/* ========================================
   QUICK CARDS
========================================= */

.quick-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 9px;

  margin-bottom: 26px;
}


.quick-card {
  min-width: 0;
  min-height: 82px;

  padding: 12px;

  display: flex;

  align-items: center;

  gap: 10px;

  border:
    1px solid #e7eaf2;

  border-radius: 19px;

  background: white;

  box-shadow:
    0 8px 26px
    rgba(15, 23, 42, 0.055);
}


.quick-icon {
  width: 43px;
  height: 43px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 13px;

  font-size: 20px;
}


.records-icon {
  background: #eef2ff;

  color: #5c5ee8;
}


.quick-card-info {
  min-width: 0;

  display: flex;

  flex-direction: column;
}


.quick-card-info strong {
  color: #151927;

  font-size: 18px;
  font-weight: 850;

  line-height: 1;
}


.quick-card-info span {
  margin-top: 4px;

  color: #9a9fad;

  font-size: 8px;

  white-space: nowrap;
}


/* ========================================
   ADD PET BUTTON
========================================= */

.add-pet-card {
  width: 100%;

  position: relative;

  border:
    1.5px solid #d9d9ff;

  background:
    linear-gradient(
      145deg,
      #ffffff 0%,
      #f8f7ff 100%
    );

  color: #111827;

  font-family: inherit;

  text-align: left;

  cursor: pointer;

  box-shadow:
    0 8px 24px
    rgba(79, 70, 229, 0.10);

  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease;
}


.add-pet-card:hover {
  border-color: #7873ee;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f2f0ff
    );

  box-shadow:
    0 12px 28px
    rgba(79, 70, 229, 0.16);

  transform: translateY(-2px);
}


.add-pet-card:active {
  transform: scale(0.965);

  box-shadow:
    0 5px 14px
    rgba(79, 70, 229, 0.13);
}


.add-pet-card-open {
  border-color: #8b87ee;

  background:
    linear-gradient(
      145deg,
      #f8f7ff,
      #eeeeff
    );
}


.add-icon {
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #7c3aed
    );

  color: white;

  box-shadow:
    0 7px 17px
    rgba(99, 102, 241, 0.30);
}


.add-info strong {
  color: #3730a3;

  font-size: 12px;

  font-weight: 850;

  line-height: 1.15;
}


.add-info span {
  color: #8c8fa1;

  font-size: 8px;

  font-weight: 550;
}


.quick-arrow {
  width: 27px;
  height: 27px;

  margin-left: auto;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #6366f1;

  color: white;

  font-size: 13px;

  box-shadow:
    0 4px 10px
    rgba(99, 102, 241, 0.25);
}


/* ========================================
   FORM DROP ANIMATION
========================================= */

.form-drop-enter-active,
.form-drop-leave-active {
  transition:
    opacity 0.30s ease,
    transform 0.30s ease;
}


.form-drop-enter-from,
.form-drop-leave-to {
  opacity: 0;

  transform:
    translateY(-15px)
    scale(0.985);
}


/* ========================================
   FLOATING FORM
========================================= */

.floating-form-card {
  position: relative;

  margin-bottom: 26px;

  padding:
    17px
    17px
    18px;

  border:
    1px solid #e4e7ef;

  border-radius: 25px;

  background: white;

  box-shadow:
    0 18px 48px
    rgba(31, 37, 71, 0.12);
}


.form-handle {
  display: flex;

  justify-content: center;

  margin:
    -5px
    0
    13px;
}


.form-handle span {
  width: 38px;
  height: 4px;

  border-radius: 999px;

  background: #dfe1ea;
}


/* ========================================
   FORM HEADER
========================================= */

.section-heading {
  position: relative;

  display: flex;

  align-items: center;

  gap: 11px;

  margin-bottom: 20px;

  padding-right: 38px;
}


.section-icon {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #5146e5,
      #8154ed
    );

  color: white;

  font-size: 20px;

  box-shadow:
    0 7px 18px
    rgba(99, 102, 241, 0.22);
}


.section-heading-text {
  min-width: 0;
}


.form-eyebrow {
  margin:
    0
    0
    2px !important;

  color:
    #6366f1 !important;

  font-size:
    7px !important;

  font-weight:
    850 !important;

  letter-spacing: 1px;
}


.section-heading h3 {
  margin: 0;

  color: #141927;

  font-size: 16px;

  font-weight: 850;
}


.section-heading p {
  margin:
    4px
    0
    0;

  color: #9aa0ae;

  font-size: 10px;

  line-height: 1.4;
}


.close-form-button {
  position: absolute;

  top: 4px;
  right: 0;

  width: 33px;
  height: 33px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 11px;

  background: #f3f4f7;

  color: #7c8290;

  font-size: 17px;

  cursor: pointer;
}


/* ========================================
   FORM GRID
========================================= */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(
        0,
        1fr
      )
    );

  gap:
    15px
    12px;
}


.field-group {
  min-width: 0;
}


.full-width {
  grid-column:
    1 / -1;
}


.field-group label {
  display: flex;

  justify-content: space-between;

  margin:
    0
    0
    7px
    2px;

  color: #393f4e;

  font-size: 10px;

  font-weight: 750;
}


.field-group label span {
  color: #a0a5b2;

  font-size: 8px;

  font-weight: 500;
}


/* ========================================
   INPUTS
========================================= */

.input-wrapper,
.textarea-wrapper {
  min-height: 51px;

  display: flex;

  align-items: center;

  overflow: hidden;

  border:
    1px solid #e2e5ec;

  border-radius: 15px;

  background: #fafbfc;

  transition: 0.2s ease;
}


.input-wrapper:focus-within,
.textarea-wrapper:focus-within {
  border-color: #8185ef;

  background: white;

  box-shadow:
    0 0 0 3px
    rgba(99, 102, 241, 0.08);
}


.input-icon-box,
.textarea-icon-box {
  width: 34px;
  height: 34px;

  margin-left: 8px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #f0f2f7;

  color: #838ba0;

  font-size: 15px;
}


.textarea-icon-box {
  align-self: flex-start;

  margin-top: 8px;
}


.modern-input {
  width: 100%;

  --padding-start: 10px;
  --padding-end: 11px;

  color: #151927;

  font-size: 12px;
}


.modern-textarea {
  min-height: 90px;

  --padding-start: 10px;
  --padding-end: 11px;

  --padding-top: 12px;
  --padding-bottom: 12px;

  color: #151927;

  font-size: 12px;
}


/* ========================================
   SELECTS
========================================= */

.select-button {
  width: 100%;

  min-height: 51px;

  padding:
    7px
    11px
    7px
    8px;

  display: flex;

  align-items: center;
  justify-content: space-between;

  border:
    1px solid #e2e5ec;

  border-radius: 15px;

  background: #fafbfc;

  color: #151927;

  font-family: inherit;

  cursor: pointer;
}


.select-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


.select-left {
  min-width: 0;

  display: flex;

  align-items: center;

  gap: 9px;

  overflow: hidden;

  font-size: 12px;

  font-weight: 650;
}


.select-left > span {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.select-emoji,
.breed-icon-box {
  width: 35px;
  height: 35px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  font-size: 18px;
}


.breed-icon-box {
  background: #eef2ff;

  color: #6366f1;

  font-size: 15px;
}


.select-placeholder {
  color: #9ea4b1;

  font-weight: 400;
}


.dropdown-arrow {
  flex-shrink: 0;

  color: #a0a5b0;

  font-size: 16px;
}


/* ========================================
   POPOVER
========================================= */

:global(.custom-popover) {
  --width:
    min(
      350px,
      calc(100vw - 26px)
    );

  --max-height: 440px;

  --border-radius: 20px;

  --box-shadow:
    0 20px 50px
    rgba(15, 23, 42, 0.22);
}


:global(.custom-popover::part(content)) {
  border-radius: 20px;

  overflow: hidden;
}


.dropdown-content {
  --background: white;
}


.dropdown-header {
  padding:
    17px
    17px
    11px;

  border-bottom:
    1px solid #f0f1f4;
}


.dropdown-title {
  display: block;

  color:
    #111827 !important;

  font-size: 14px;

  font-weight: 850;
}


.dropdown-subtitle {
  display: block;

  margin-top: 3px;

  color: #8d93a1;

  font-size: 10px;
}


.dropdown-option {
  --background: white;
  --color: #111827;

  --padding-start: 11px;
  --padding-end: 11px;

  margin:
    4px
    9px;

  border-radius: 13px;
}


.dropdown-option::part(native) {
  border-radius: 13px;
}


.dropdown-option-selected {
  --background: #eef2ff;
}


.option-emoji {
  width: 40px;
  height: 40px;

  margin-right: 11px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  font-size: 22px;
}


.dropdown-option ion-label {
  color:
    #111827 !important;
}


.option-name {
  margin:
    0 !important;

  color:
    #111827 !important;

  font-size:
    12px !important;

  font-weight:
    800 !important;
}


.dropdown-option ion-label p {
  margin-top: 2px;

  color:
    #8b91a0 !important;

  font-size: 9px;
}


.selected-check {
  color: #6366f1;

  font-size: 21px;
}


/* ========================================
   FORM BUTTONS
========================================= */

.form-actions {
  margin-top: 20px;
}


.save-button {
  height: 49px;

  --background:
    linear-gradient(
      135deg,
      #5146e5,
      #7047ee
    );

  --border-radius: 14px;

  --box-shadow:
    0 8px 20px
    rgba(79, 70, 229, 0.22);

  font-size: 11px;

  font-weight: 750;

  text-transform: none;
}


.cancel-button {
  margin-top: 2px;

  --color: #777e8d;

  font-size: 10px;

  font-weight: 650;

  text-transform: none;
}


/* ========================================
   RECORDS HEADER
========================================= */

.records-header {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin:
    0
    2px
    12px;
}


.records-label {
  margin:
    0
    0
    3px;

  color: #9ca3af;

  font-size: 8px;

  font-weight: 850;

  letter-spacing: 1.25px;
}


.records-header h3 {
  margin: 0;

  color: #111622;

  font-size: 20px;

  font-weight: 850;

  letter-spacing: -0.4px;
}


.records-subtitle {
  margin:
    4px
    0
    0;

  color: #9ba1ae;

  font-size: 9px;
}


.records-count {
  min-width: 35px;
  height: 35px;

  padding:
    0
    10px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eef2ff;

  color: #5655dc;

  font-size: 11px;

  font-weight: 850;
}


/* ========================================
   SEARCH
========================================= */

.search-filter-card {
  margin-bottom: 14px;

  padding: 12px;

  border:
    1px solid #e8ebf2;

  border-radius: 19px;

  background: white;

  box-shadow:
    0 7px 22px
    rgba(15, 23, 42, 0.04);
}


.search-wrapper {
  min-height: 46px;

  display: flex;

  align-items: center;

  overflow: hidden;

  border:
    1px solid #e2e5eb;

  border-radius: 14px;

  background: #fafbfc;
}


.search-wrapper:focus-within {
  border-color: #8589ee;

  background: white;

  box-shadow:
    0 0 0 3px
    rgba(99, 102, 241, 0.07);
}


.search-icon {
  margin-left: 14px;

  color: #9ca3af;

  font-size: 17px;
}


.search-input {
  width: 100%;

  --padding-start: 9px;
  --padding-end: 10px;

  color: #111827;

  font-size: 10px;
}


/* ========================================
   FILTERS
========================================= */

.filter-title-area {
  display: flex;

  justify-content: space-between;

  margin:
    12px
    3px
    8px;
}


.filter-small-label {
  color: #8d93a1;

  font-size: 7px;

  font-weight: 850;

  letter-spacing: 0.8px;
}


.clear-filter-button {
  border: none;

  background: transparent;

  color: #6366f1;

  font-family: inherit;

  font-size: 8px;

  font-weight: 750;

  cursor: pointer;
}


.filter-scroll {
  display: flex;

  gap: 6px;

  overflow-x: auto;

  padding-bottom: 2px;

  scrollbar-width: none;
}


.filter-scroll::-webkit-scrollbar {
  display: none;
}


.filter-chip {
  flex-shrink: 0;

  min-height: 34px;

  padding:
    6px
    11px;

  display: flex;

  align-items: center;

  gap: 5px;

  border:
    1px solid #e2e5ec;

  border-radius: 999px;

  background: #fafbfc;

  color: #676d7a;

  font-family: inherit;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.18s ease;
}


.filter-chip:active {
  transform: scale(0.96);
}


.filter-chip.active {
  border-color: transparent;

  background:
    linear-gradient(
      135deg,
      #5146e5,
      #7047ee
    );

  color: white;

  box-shadow:
    0 5px 12px
    rgba(79, 70, 229, 0.19);
}


.filter-emoji {
  font-size: 12px;
}


/* ========================================
   STATES
========================================= */

.state-card {
  padding:
    38px
    20px;

  border:
    1px dashed #dfe3ec;

  border-radius: 21px;

  background: white;

  text-align: center;
}


.state-icon {
  width: 53px;
  height: 53px;

  margin:
    0
    auto
    11px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 17px;

  background: #eef2ff;

  color: #6366f1;

  font-size: 23px;
}


.state-card h4 {
  margin: 0;

  color: #111827;

  font-size: 14px;
}


.state-card p {
  max-width: 300px;

  margin:
    6px
    auto
    0;

  color: #969ca9;

  font-size: 10px;

  line-height: 1.5;
}


.empty-button {
  margin-top: 9px;

  --color: #6366f1;

  font-size: 10px;

  font-weight: 700;

  text-transform: none;
}


/* ========================================
   PET GRID
========================================= */

.pets-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(
        280px,
        1fr
      )
    );

  gap: 12px;
}


/* ========================================
   PET CARD
========================================= */

.pet-card {
  --pet-accent: #6366f1;

  position: relative;

  padding: 15px;

  overflow: hidden;

  border:
    1px solid #e8ebf1;

  border-radius: 21px;

  background: white;

  box-shadow:
    0 8px 24px
    rgba(15, 23, 42, 0.05);
}


.pet-card::before {
  content: '';

  position: absolute;

  top: 0;
  left: 20px;
  right: 20px;

  height: 3px;

  border-radius:
    0
    0
    999px
    999px;

  background:
    var(--pet-accent);

  opacity: 0.55;
}


.pet-card-dog {
  --pet-accent: #f59e0b;
}


.pet-card-cat {
  --pet-accent: #a855f7;
}


.pet-card-bird {
  --pet-accent: #3b82f6;
}


.pet-card-rabbit {
  --pet-accent: #ec4899;
}


.pet-card-fish {
  --pet-accent: #06b6d4;
}


.pet-card-other {
  --pet-accent: #64748b;
}


/* ========================================
   PET TOP
========================================= */

.pet-card-top {
  display: flex;

  align-items: center;

  gap: 11px;
}


.pet-avatar {
  width: 51px;
  height: 51px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 16px;

  font-size: 26px;
}


.pet-main-info {
  min-width: 0;

  flex: 1;
}


.pet-main-info h4 {
  margin: 0;

  overflow: hidden;

  color: #111622;

  font-size: 15px;

  font-weight: 850;

  text-overflow: ellipsis;

  white-space: nowrap;
}


.pet-type {
  display: flex;

  gap: 4px;

  margin-top: 4px;

  overflow: hidden;

  color: #777e8c;

  font-size: 9px;

  white-space: nowrap;
}


.pet-type span:last-child {
  overflow: hidden;

  text-overflow: ellipsis;
}


.dot {
  color: #c2c6cf;
}


/* ========================================
   AGE
========================================= */

.age-badge {
  min-width: 42px;

  padding:
    8px
    7px;

  border-radius: 12px;

  background: #f5f6f9;

  text-align: center;
}


.age-badge strong {
  display: block;

  color: #414754;

  font-size: 13px;

  font-weight: 850;
}


.age-badge span {
  display: block;

  margin-top: 1px;

  color: #a1a6b1;

  font-size: 6px;

  font-weight: 650;
}


/* ========================================
   PET DETAILS
========================================= */

.pet-details {
  display: flex;

  flex-direction: column;

  gap: 10px;

  margin-top: 14px;

  padding:
    12px
    0;

  border-top:
    1px solid #f0f1f4;

  border-bottom:
    1px solid #f0f1f4;
}


.detail-row {
  display: flex;

  align-items: flex-start;

  gap: 9px;
}


.detail-icon {
  width: 29px;
  height: 29px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #f1f3ff;

  color: #6870e8;

  font-size: 13px;
}


.detail-content {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 1px;
}


.detail-label {
  color: #a0a5b0;

  font-size: 7px;

  font-weight: 850;

  letter-spacing: 0.5px;
}


.detail-content strong {
  color: #414754;

  font-size: 10px;

  font-weight: 650;
}


.notes-text {
  display: -webkit-box;

  overflow: hidden;

  line-height: 1.4;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;
}


/* ========================================
   PET ACTIONS
========================================= */

.pet-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 7px;

  margin-top: 10px;
}


.edit-button,
.delete-button {
  height: 36px;

  margin: 0;

  border-radius: 10px;

  font-size: 9px;

  font-weight: 750;

  text-transform: none;
}


.edit-button {
  --color: #5659da;

  background: #eef2ff;
}


.delete-button {
  --color: #dc4b4b;

  background: #fff1f1;
}


/* ========================================
   ANIMAL BACKGROUNDS
========================================= */

.animal-dog {
  background: #fff3e9;
}


.animal-cat {
  background: #f8edff;
}


.animal-bird {
  background: #edf6ff;
}


.animal-rabbit {
  background: #fff0f4;
}


.animal-fish {
  background: #eafcff;
}


.animal-other {
  background: #f1f2f5;
}


/* ========================================
   RECORD TOOLS / SORT BUTTON
========================================= */

.records-tools {
  display: flex;
  align-items: center;
  gap: 7px;
}


.sort-button {
  min-height: 35px;
  padding: 0 11px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  border: 1px solid #dedfff;
  border-radius: 11px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f6f5ff
    );

  color: #5753d9;

  font-family: inherit;
  font-size: 9px;
  font-weight: 750;

  cursor: pointer;

  box-shadow:
    0 4px 12px
    rgba(79, 70, 229, 0.07);
}


.sort-button ion-icon {
  font-size: 14px;
}


/* ========================================
   PET CARD INTERACTION
========================================= */

.pet-card {
  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}


.pet-card:hover {
  transform: translateY(-2px);

  border-color: #dfe1f4;

  box-shadow:
    0 11px 28px
    rgba(15, 23, 42, 0.075);
}


.pet-card:focus-visible {
  outline:
    3px solid
    rgba(99, 102, 241, 0.16);

  outline-offset: 2px;
}


.view-details-hint {
  min-height: 29px;

  margin-top: 9px;
  padding: 0 3px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #8d92a2;

  font-size: 8px;
  font-weight: 650;
}


.view-details-hint > div {
  display: flex;
  align-items: center;
  gap: 5px;
}


.view-details-hint ion-icon {
  color: #6865df;
  font-size: 12px;
}


.view-details-arrow {
  color:
    #b3b6c2 !important;

  font-size:
    11px !important;
}


/* ========================================
   SHARED BOTTOM SHEET
========================================= */

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99996;

  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    rgba(15, 23, 42, 0.43);

  backdrop-filter: blur(5px);
}


.details-sheet,
.sort-sheet {
  position: relative;

  width:
    min(
      100%,
      440px
    );

  max-height:
    min(
      88vh,
      720px
    );

  overflow-y: auto;

  padding: 16px;

  border:
    1px solid
    rgba(255, 255, 255, 0.78);

  border-radius: 25px;

  background: white;

  box-shadow:
    0 25px 70px
    rgba(15, 23, 42, 0.24);

  scrollbar-width: none;
}


.details-sheet::-webkit-scrollbar,
.sort-sheet::-webkit-scrollbar {
  display: none;
}


.sheet-handle {
  display: flex;
  justify-content: center;

  margin:
    -3px
    0
    11px;
}


.sheet-handle span {
  width: 36px;
  height: 4px;

  border-radius: 999px;

  background: #dddfe7;
}


.sheet-close-button {
  position: absolute;

  top: 13px;
  right: 13px;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 10px;

  background: #f3f4f7;

  color: #757b89;

  font-size: 16px;

  cursor: pointer;
}


/* ========================================
   PET DETAILS SHEET
========================================= */

.details-hero {
  display: flex;
  align-items: center;
  gap: 11px;

  padding:
    5px
    39px
    16px
    2px;

  border-bottom:
    1px solid #f0f1f4;
}


.details-avatar {
  width: 59px;
  height: 59px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 19px;

  font-size: 31px;
}


.details-title {
  min-width: 0;
  flex: 1;
}


.details-title p {
  margin: 0 0 2px;

  color: #7773e7;

  font-size: 7px;
  font-weight: 850;

  letter-spacing: 1px;
}


.details-title h3 {
  margin: 0;

  overflow: hidden;

  color: #111827;

  font-size: 19px;
  font-weight: 850;

  text-overflow: ellipsis;
  white-space: nowrap;
}


.details-title span {
  display: block;

  margin-top: 4px;

  color: #7c8290;

  font-size: 9px;
}


.details-age {
  min-width: 57px;

  padding:
    9px
    7px;

  border-radius: 14px;

  background: #f4f5f9;

  text-align: center;
}


.details-age strong {
  display: block;

  color: #303646;

  font-size: 17px;
  font-weight: 850;
}


.details-age span {
  display: block;

  margin-top: 1px;

  color: #979daa;

  font-size: 6px;
}


.details-info-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 13px;
}


.details-info-card {
  min-width: 0;

  padding: 11px;

  border:
    1px solid #ebedf3;

  border-radius: 15px;

  background: #fafbfc;
}


.details-info-icon {
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #eef2ff;

  color: #6265df;

  font-size: 13px;
}


.details-info-card > span {
  display: block;

  margin-top: 8px;

  color: #9ba0ac;

  font-size: 7px;
  font-weight: 750;

  text-transform: uppercase;
  letter-spacing: 0.5px;
}


.details-info-card > strong {
  display: block;

  margin-top: 2px;

  overflow: hidden;

  color: #3d4352;

  font-size: 10px;
  font-weight: 750;

  text-overflow: ellipsis;
  white-space: nowrap;
}


.details-notes-card {
  margin-top: 9px;
  padding: 12px;

  border:
    1px solid #ebedf3;

  border-radius: 15px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #fafaff
    );
}


.details-notes-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}


.details-notes-heading > div:last-child {
  display: flex;
  flex-direction: column;
}


.details-notes-heading span {
  color: #9ba0ac;

  font-size: 7px;
  font-weight: 850;

  letter-spacing: 0.6px;
}


.details-notes-heading strong {
  margin-top: 1px;

  color: #3d4352;

  font-size: 10px;
}


.details-notes-card p {
  margin:
    10px
    1px
    0;

  color: #6e7481;

  font-size: 10px;

  line-height: 1.55;

  overflow-wrap: anywhere;
}


.details-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 13px;
}


.details-edit-button,
.details-delete-button {
  min-height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border-radius: 13px;

  font-family: inherit;
  font-size: 10px;
  font-weight: 750;

  cursor: pointer;
}


.details-edit-button {
  border:
    1px solid #deddff;

  background:
    linear-gradient(
      145deg,
      #f7f6ff,
      #eeeeff
    );

  color: #5351d6;
}


.details-delete-button {
  border:
    1px solid #ffdcdc;

  background: #fff3f3;

  color: #df4545;
}


/* ========================================
   SORT SHEET
========================================= */

.sort-sheet {
  width:
    min(
      100%,
      390px
    );
}


.sort-sheet-header {
  position: relative;

  display: flex;
  align-items: center;
  gap: 10px;

  padding:
    3px
    36px
    13px
    1px;

  border-bottom:
    1px solid #f0f1f4;
}


.sort-heading-icon {
  width: 39px;
  height: 39px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #5146e5,
      #7c3aed
    );

  color: white;

  font-size: 18px;
}


.sort-sheet-header p {
  margin: 0 0 1px;

  color: #7470df;

  font-size: 7px;
  font-weight: 850;

  letter-spacing: 0.9px;
}


.sort-sheet-header h3 {
  margin: 0;

  color: #151927;

  font-size: 16px;
  font-weight: 850;
}


.sort-sheet-header span {
  display: block;

  margin-top: 3px;

  color: #969ca9;

  font-size: 8px;
}


.sort-close-button {
  top: 4px;
  right: 0;
}


.sort-options {
  display: flex;
  flex-direction: column;
  gap: 6px;

  margin-top: 11px;
}


.sort-option {
  width: 100%;

  min-height: 53px;

  padding:
    9px
    11px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  border:
    1px solid #e8eaf0;

  border-radius: 13px;

  background: #fafbfc;

  color: #303646;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
}


.sort-option > div {
  min-width: 0;

  display: flex;
  flex-direction: column;
}


.sort-option strong {
  font-size: 10px;
  font-weight: 780;
}


.sort-option span {
  margin-top: 2px;

  color: #949aa7;

  font-size: 8px;
}


.sort-option-active {
  border-color: #d4d2ff;

  background:
    linear-gradient(
      145deg,
      #f5f4ff,
      #ededff
    );
}


.sort-check {
  flex-shrink: 0;

  color: #5c5be0;

  font-size: 20px;
}


/* ========================================
   SHEET ANIMATION
========================================= */

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition:
    opacity 0.22s ease;
}


.sheet-fade-enter-active .details-sheet,
.sheet-fade-leave-active .details-sheet,
.sheet-fade-enter-active .sort-sheet,
.sheet-fade-leave-active .sort-sheet {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}


.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}


.sheet-fade-enter-from .details-sheet,
.sheet-fade-leave-to .details-sheet,
.sheet-fade-enter-from .sort-sheet,
.sheet-fade-leave-to .sort-sheet {
  opacity: 0;

  transform:
    translateY(18px)
    scale(0.98);
}


/* ========================================
   CUSTOM TOAST
========================================= */

.app-toast {
  position: fixed;

  top:
    calc(
      env(safe-area-inset-top)
      + 13px
    );

  left: 50%;

  z-index: 99999;

  width:
    min(
      calc(100% - 24px),
      420px
    );

  min-height: 66px;

  padding:
    11px
    12px;

  display: flex;

  align-items: center;

  gap: 10px;

  border:
    1px solid #e8eaf1;

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.98);

  box-shadow:
    0 15px 42px
    rgba(15, 23, 42, 0.18);

  backdrop-filter: blur(16px);

  transform: translateX(-50%);
}


.toast-status-icon {
  width: 39px;
  height: 39px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  font-size: 21px;
}


.toast-success .toast-status-icon {
  background: #ecfdf3;

  color: #16a34a;
}


.toast-warning .toast-status-icon {
  background: #fff8e6;

  color: #d97706;
}


.toast-danger .toast-status-icon {
  background: #fff1f2;

  color: #dc2626;
}


.toast-content {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 2px;
}


.toast-content strong {
  color: #111827;

  font-size: 11px;

  font-weight: 850;
}


.toast-content span {
  color: #737987;

  font-size: 9px;

  line-height: 1.4;
}


.toast-close {
  width: 30px;
  height: 30px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 9px;

  background: #f4f5f8;

  color: #777d8b;

  font-size: 16px;

  cursor: pointer;
}


.toast-pop-enter-active,
.toast-pop-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}


.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;

  transform:
    translateX(-50%)
    translateY(-15px)
    scale(0.97);
}


/* ========================================
   DELETE DIALOG
========================================= */

.dialog-backdrop {
  position: fixed;

  inset: 0;

  z-index: 99998;

  padding: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(15, 23, 42, 0.50);

  backdrop-filter: blur(5px);
}


.delete-dialog {
  width:
    min(
      100%,
      360px
    );

  padding: 23px;

  border:
    1px solid
    rgba(255, 255, 255, 0.75);

  border-radius: 24px;

  background: white;

  text-align: center;

  box-shadow:
    0 24px 65px
    rgba(15, 23, 42, 0.25);
}


.delete-dialog-icon {
  width: 58px;
  height: 58px;

  margin:
    0
    auto
    14px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 18px;

  background: #fff0f0;

  color: #ef4444;

  font-size: 25px;
}


.delete-dialog h3 {
  margin: 0;

  color: #111827;

  font-size: 19px;

  font-weight: 850;
}


.delete-dialog p {
  margin:
    8px
    auto
    0;

  max-width: 280px;

  color: #747b89;

  font-size: 11px;

  line-height: 1.55;
}


.delete-dialog p strong {
  color: #303645;

  font-weight: 800;
}


.delete-dialog-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 9px;

  margin-top: 20px;
}


.dialog-cancel-button,
.dialog-delete-button {
  min-height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 6px;

  border-radius: 13px;

  font-family: inherit;

  font-size: 11px;

  font-weight: 750;

  cursor: pointer;
}


.dialog-cancel-button {
  border:
    1px solid #e4e7ed;

  background: #f8f9fb;

  color: #555c6a;
}


.dialog-delete-button {
  border: none;

  background:
    linear-gradient(
      135deg,
      #ef4444,
      #dc2626
    );

  color: white;

  box-shadow:
    0 7px 16px
    rgba(220, 38, 38, 0.22);
}


.dialog-delete-button:active,
.dialog-cancel-button:active {
  transform: scale(0.97);
}


.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.22s ease;
}


.dialog-fade-enter-active .delete-dialog,
.dialog-fade-leave-active .delete-dialog {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}


.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}


.dialog-fade-enter-from .delete-dialog,
.dialog-fade-leave-to .delete-dialog {
  opacity: 0;

  transform:
    translateY(12px)
    scale(0.96);
}


/* ========================================
   MOBILE
========================================= */

@media (max-width: 600px) {

  .page-container {
    padding:
      11px
      11px;
  }


  /* More compact native-phone header */
  .modern-toolbar {
    --min-height: 62px;
  }


  .header-content {
    padding:
      calc(env(safe-area-inset-top) + 4px)
      14px
      6px;
  }


  .header-icon {
    width: 38px;
    height: 38px;

    border-radius: 12px;

    font-size: 20px;
  }


  .brand-area {
    gap: 9px;
  }


  .brand-text h1 {
    font-size: 18px;
  }


  .brand-text p {
    font-size: 7px;
  }


  .header-decoration {
    width: 30px;
    height: 30px;

    font-size: 14px;
  }


  /* Reduce the empty vertical space above the form */
  .hero-section {
    padding-top: 2px;

    margin-bottom: 13px;
  }


  .hero-eyebrow {
    margin-bottom: 4px;

    font-size: 8px;
  }


  .hero-section h2 {
    font-size: 21px;

    line-height: 1.06;
  }


  .hero-description {
    margin-top: 6px;

    font-size: 9px;

    line-height: 1.4;
  }


  .quick-actions {
    gap: 8px;

    margin-bottom: 16px;
  }


  .quick-card {
    min-height: 66px;

    padding: 8px;

    gap: 7px;

    border-radius: 15px;
  }


  .quick-icon {
    width: 34px;
    height: 34px;

    border-radius: 10px;

    font-size: 16px;
  }


  .quick-card-info strong {
    font-size: 14px;
  }


  .add-info strong {
    font-size: 10px;
  }


  .quick-card-info span,
  .add-info span {
    font-size: 6px;
  }


  .quick-arrow {
    width: 20px;
    height: 20px;

    font-size: 9px;
  }


  /* ========================================
     COMPACT MOBILE ADD / EDIT FORM

     Pet Name     = full row
     Animal/Breed = same row
     Age/Owner    = same row
     Notes        = full row
  ========================================= */

  .floating-form-card {
    margin-bottom: 16px;

    padding:
      12px
      11px
      12px;

    border-radius: 19px;

    box-shadow:
      0 11px 30px
      rgba(31, 37, 71, 0.09);
  }


  .form-handle {
    margin:
      -1px
      0
      7px;
  }


  .form-handle span {
    width: 31px;
    height: 3px;
  }


  .section-heading {
    gap: 8px;

    margin-bottom: 12px;

    padding-right: 32px;
  }


  .section-icon {
    width: 36px;
    height: 36px;

    border-radius: 11px;

    font-size: 16px;
  }


  .section-heading h3 {
    font-size: 14px;
  }


  .section-heading p {
    margin-top: 2px;

    font-size: 8px;
  }


  .form-eyebrow {
    font-size:
      6px !important;
  }


  .close-form-button {
    top: 1px;

    width: 28px;
    height: 28px;

    border-radius: 9px;

    font-size: 14px;
  }


  .form-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap:
      10px
      8px;
  }


  .pet-name-field,
  .notes-field {
    grid-column:
      1 / -1;
  }


  .animal-field,
  .breed-field,
  .age-field,
  .owner-field {
    grid-column:
      auto;
  }


  /* Override full-width owner only on mobile */
  .owner-field.full-width {
    grid-column:
      auto;
  }


  .field-group label {
    margin:
      0
      0
      4px
      1px;

    font-size: 9px;
  }


  .field-group label span {
    font-size: 7px;
  }


  .input-wrapper,
  .textarea-wrapper {
    min-height: 43px;

    border-radius: 12px;
  }


  .input-icon-box,
  .textarea-icon-box {
    width: 28px;
    height: 28px;

    margin-left: 6px;

    border-radius: 8px;

    font-size: 12px;
  }


  .textarea-icon-box {
    margin-top: 6px;
  }


  .modern-input {
    --padding-start: 7px;
    --padding-end: 7px;

    font-size: 10px;
  }


  .modern-textarea {
    min-height: 58px;

    --padding-start: 7px;
    --padding-end: 7px;
    --padding-top: 9px;
    --padding-bottom: 8px;

    font-size: 10px;
  }


  .select-button {
    min-height: 43px;

    padding:
      5px
      7px
      5px
      6px;

    border-radius: 12px;
  }


  .select-left {
    gap: 5px;

    font-size: 9px;
  }


  .select-emoji,
  .breed-icon-box {
    width: 28px;
    height: 28px;

    border-radius: 8px;

    font-size: 14px;
  }


  .breed-icon-box {
    font-size: 12px;
  }


  .dropdown-arrow {
    font-size: 12px;
  }


  .form-actions {
    margin-top: 11px;
  }


  .save-button {
    height: 42px;

    --border-radius: 12px;

    font-size: 9px;
  }


  .cancel-button {
    height: 30px;

    margin-top: 0;

    font-size: 8px;
  }


  /* Keep the records section compact as well */
  .records-header {
    margin-bottom: 9px;
  }


  .records-header h3 {
    font-size: 18px;
  }


  .records-subtitle {
    font-size: 8px;
  }


  .records-count {
    min-width: 32px;
    height: 32px;

    font-size: 9px;
  }


  .search-filter-card {
    padding: 9px;

    border-radius: 15px;
  }


  .search-wrapper {
    min-height: 40px;

    border-radius: 11px;
  }


  .filter-chip {
    min-height: 31px;

    padding:
      5px
      9px;

    font-size: 8px;
  }


  .pets-grid {
    grid-template-columns:
      1fr;
  }


  .delete-dialog {
    padding:
      20px
      17px;
  }

}


/* ========================================
   MOBILE SHEETS / SORT
========================================= */

@media (max-width: 600px) {

  .records-tools {
    gap: 5px;
  }


  .sort-button {
    min-height: 32px;

    padding:
      0
      9px;

    border-radius: 10px;

    font-size: 8px;
  }


  .sort-button ion-icon {
    font-size: 12px;
  }


  .view-details-hint {
    min-height: 26px;

    margin-top: 7px;

    font-size: 7px;
  }


  .pet-card:hover {
    transform: none;
  }


  .sheet-backdrop {
    padding: 0;

    align-items: flex-end;
  }


  .details-sheet,
  .sort-sheet {
    width: 100%;

    max-height: 88vh;

    padding:
      13px
      13px
      calc(
        env(safe-area-inset-bottom)
        + 14px
      );

    border-radius:
      24px
      24px
      0
      0;

    border-bottom: none;
  }


  .sheet-close-button {
    top: 11px;
    right: 12px;
  }


  .details-hero {
    padding:
      4px
      38px
      13px
      1px;
  }


  .details-avatar {
    width: 54px;
    height: 54px;

    border-radius: 17px;

    font-size: 28px;
  }


  .details-title h3 {
    font-size: 17px;
  }


  .details-info-grid {
    gap: 7px;

    margin-top: 11px;
  }


  .details-info-card {
    padding: 10px;

    border-radius: 13px;
  }


  .details-actions {
    position: sticky;

    bottom: 0;

    padding-top: 9px;

    background: white;
  }


  .sort-option {
    min-height: 50px;
  }


  .sheet-fade-enter-from .details-sheet,
  .sheet-fade-leave-to .details-sheet,
  .sheet-fade-enter-from .sort-sheet,
  .sheet-fade-leave-to .sort-sheet {
    transform:
      translateY(45px);
  }

}


/* ========================================
   VERY SMALL MOBILE
========================================= */

@media (max-width: 340px) {

  /*
   * Two-column form can become cramped on
   * very narrow phones, so stack it again.
   */
  .form-grid {
    grid-template-columns:
      1fr;
  }


  .pet-name-field,
  .animal-field,
  .breed-field,
  .age-field,
  .owner-field,
  .notes-field,
  .owner-field.full-width {
    grid-column:
      1;
  }


  .quick-card {
    padding:
      7px
      6px;
  }


  .quick-icon {
    width: 32px;
    height: 32px;
  }


  .quick-card-info strong {
    font-size: 13px;
  }


  .add-info strong {
    font-size: 9px;
  }


  .quick-arrow {
    display: none;
  }

}


.bottom-space {
  height: 28px;
}

</style>