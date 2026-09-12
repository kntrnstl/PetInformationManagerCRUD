<template>
  <ion-page>

    <!-- =========================
         HEADER
    ========================== -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="modern-toolbar">
        <div class="header-content">

          <div class="header-icon">
            <ion-icon :icon="pawOutline" />
          </div>

          <div>
            <p class="header-label">PET MANAGER</p>
            <h1>My Pets</h1>
          </div>

        </div>
      </ion-toolbar>
    </ion-header>


    <!-- =========================
         CONTENT
    ========================== -->
    <ion-content
      ref="contentRef"
      :fullscreen="true"
      class="app-content"
    >

      <div class="page-container">

        <!-- =========================
             HERO
        ========================== -->
        <section class="hero-section">

          <div class="hero-text">

            <p class="hero-eyebrow">
              Pet Information Manager
            </p>

            <h2>
              Keep your pet records
              <span>organized.</span>
            </h2>

            <p class="hero-description">
              Add, update, and manage your pet information in one place.
            </p>

          </div>


          <div class="pet-count-card">

            <div class="count-icon">
              <ion-icon :icon="paw" />
            </div>

            <div>
              <span class="count-number">
                {{ pets.length }}
              </span>

              <span class="count-label">
                {{ pets.length === 1 ? 'Pet Record' : 'Pet Records' }}
              </span>
            </div>

          </div>

        </section>


        <!-- =========================
             ADD / EDIT FORM
        ========================== -->
        <section class="form-card">

          <div class="section-heading">

            <div class="section-icon">
              <ion-icon
                :icon="editingId ? createOutline : addOutline"
              />
            </div>

            <div>
              <h3>
                {{ editingId ? 'Edit Pet' : 'Add New Pet' }}
              </h3>

              <p>
                {{
                  editingId
                    ? 'Update the pet information below.'
                    : 'Fill in the details of your pet.'
                }}
              </p>
            </div>

          </div>


          <!-- =========================
               FORM GRID
          ========================== -->
          <div class="form-grid">

            <!-- PET NAME -->
            <div class="field-group">

              <label>
                Pet Name
              </label>

              <div class="input-wrapper">

                <ion-icon
                  :icon="pawOutline"
                  class="input-icon"
                />

                <ion-input
                  v-model="form.name"
                  placeholder="e.g. Bruno"
                  class="modern-input"
                />

              </div>

            </div>


            <!-- =========================
                 ANIMAL TYPE
            ========================== -->
            <div class="field-group">

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
                      'Select animal type'
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
                      Select your pet category
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


            <!-- =========================
                 BREED
            ========================== -->
            <div class="field-group">

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
                          : 'Select animal first'
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
            <div class="field-group">

              <label>
                Age
              </label>

              <div class="input-wrapper">

                <ion-icon
                  :icon="calendarOutline"
                  class="input-icon"
                />

                <ion-input
                  v-model="form.age"
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  class="modern-input"
                />

              </div>

            </div>


            <!-- OWNER NAME -->
            <div class="field-group full-width">

              <label>
                Owner Name
              </label>

              <div class="input-wrapper">

                <ion-icon
                  :icon="personOutline"
                  class="input-icon"
                />

                <ion-input
                  v-model="form.ownerName"
                  placeholder="Enter owner name"
                  class="modern-input"
                />

              </div>

            </div>


            <!-- NOTES -->
            <div class="field-group full-width">

              <label>
                Notes

                <span>
                  Optional
                </span>
              </label>

              <div class="textarea-wrapper">

                <ion-icon
                  :icon="documentTextOutline"
                  class="textarea-icon"
                />

                <ion-textarea
                  v-model="form.notes"
                  placeholder="Add notes about your pet..."
                  :auto-grow="true"
                  :rows="3"
                  class="modern-textarea"
                />

              </div>

            </div>

          </div>


          <!-- =========================
               FORM ACTIONS
          ========================== -->
          <div class="form-actions">

            <ion-button
              expand="block"
              class="save-button"
              @click="savePet"
            >

              <ion-icon
                slot="start"
                :icon="editingId ? saveOutline : addCircleOutline"
              />

              {{
                editingId
                  ? 'Save Changes'
                  : 'Add Pet'
              }}

            </ion-button>


            <ion-button
              v-if="editingId"
              expand="block"
              fill="clear"
              class="cancel-button"
              @click="resetForm"
            >
              Cancel Editing
            </ion-button>

          </div>

        </section>


        <!-- =========================
             RECORDS HEADER
        ========================== -->
        <section class="records-header">

          <div>

            <p class="records-label">
              YOUR PETS
            </p>

            <h3>
              Pet Records
            </h3>

          </div>


          <div class="record-badge">
            {{ pets.length }}
          </div>

        </section>


        <!-- =========================
             LOADING
        ========================== -->
        <div
          v-if="loading"
          class="state-card"
        >

          <div class="state-icon loading-icon">
            <ion-spinner name="crescent" />
          </div>

          <h4>
            Loading pets
          </h4>

          <p>
            Fetching your pet records...
          </p>

        </div>


        <!-- =========================
             EMPTY STATE
        ========================== -->
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
            Add your first pet using the form above.
          </p>

        </div>


        <!-- =========================
             PET CARDS
        ========================== -->
        <div
          v-else
          class="pets-grid"
        >

          <article
            v-for="pet in pets"
            :key="pet.id"
            class="pet-card"
          >

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

                {{ pet.age }}

                <span>
                  yrs
                </span>

              </div>

            </div>


            <!-- PET DETAILS -->
            <div class="pet-details">

              <div class="detail-row">

                <div class="detail-icon">
                  <ion-icon :icon="personOutline" />
                </div>

                <div>

                  <span class="detail-label">
                    Owner
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

                <div>

                  <span class="detail-label">
                    Notes
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


            <!-- ACTION BUTTONS -->
            <div class="pet-actions">

              <ion-button
                fill="clear"
                class="edit-button"
                @click="editPet(pet)"
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
                @click="confirmDelete(pet)"
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


      <!-- =========================
           DELETE CONFIRMATION
      ========================== -->
      <ion-alert
        :is-open="deleteAlertOpen"
        header="Delete Pet?"
        :message="
          `Are you sure you want to delete ${
            petToDelete?.name || 'this pet'
          }? This action cannot be undone.`
        "
        :buttons="deleteAlertButtons"
        @didDismiss="deleteAlertOpen = false"
      />

    </ion-content>

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
  IonAlert,
  IonSpinner,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  toastController,
  popoverController
} from '@ionic/vue';


import {
  reactive,
  ref,
  computed,
  onMounted,
  onUnmounted
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
  checkmarkCircle
} from 'ionicons/icons';


import { db } from '../firebase';


/* =========================
   PET INTERFACE
========================= */

interface Pet {
  id: string;
  name: string;
  animalType: string;
  breed: string;
  age: number;
  ownerName: string;
  notes: string;
}


/* =========================
   ANIMAL INTERFACE
========================= */

interface AnimalType {
  label: string;
  value: string;
  emoji: string;
  description: string;
}


/* =========================
   CONTENT REF
========================= */

const contentRef =
  ref<InstanceType<typeof IonContent> | null>(null);


/* =========================
   ANIMAL TYPES
========================= */

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


/* =========================
   BREED OPTIONS
========================= */

const breedOptions: Record<string, string[]> = {

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


/* =========================
   VARIABLES
========================= */

const pets =
  ref<Pet[]>([]);

const loading =
  ref(true);

const editingId =
  ref<string | null>(null);

const deleteAlertOpen =
  ref(false);

const petToDelete =
  ref<Pet | null>(null);


/* =========================
   FORM
========================= */

const form = reactive({
  name: '',
  animalType: '',
  breed: '',
  age: '',
  ownerName: '',
  notes: ''
});


/* =========================
   AVAILABLE BREEDS
========================= */

const availableBreeds = computed(() => {

  if (!form.animalType) {
    return [];
  }

  return breedOptions[
    form.animalType
  ] || [];

});


/* =========================
   TOAST
========================= */

const showToast = async (
  message: string,
  color: string = 'success'
) => {

  const toast = await toastController.create({
    message,
    duration: 2200,
    color,
    position: 'top',
    buttons: [
      {
        text: 'OK',
        role: 'cancel'
      }
    ]
  });

  await toast.present();

};


/* =========================
   ANIMAL EMOJI
========================= */

const getAnimalEmoji = (
  animalType: string
) => {

  if (!animalType) {
    return '🐾';
  }

  switch (
    animalType.toLowerCase()
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


/* =========================
   ANIMAL CSS CLASS
========================= */

const getAnimalClass = (
  animalType: string
) => {

  if (!animalType) {
    return 'animal-other';
  }

  return `animal-${animalType.toLowerCase()}`;

};


/* =========================
   SELECT ANIMAL
========================= */

const selectAnimal = async (
  animalType: string
) => {

  /*
   * If animal type changes,
   * reset its previous breed.
   */
  if (
    form.animalType !== animalType
  ) {
    form.breed = '';
  }

  form.animalType =
    animalType;

  await popoverController.dismiss();

};


/* =========================
   SELECT BREED
========================= */

const selectBreed = async (
  breed: string
) => {

  form.breed =
    breed;

  await popoverController.dismiss();

};


/* =========================
   READ PETS
========================= */

let unsubscribe:
  (() => void) | null =
  null;


onMounted(() => {

  const petsRef =
    databaseRef(
      db,
      'pets'
    );


  unsubscribe = onValue(

    petsRef,

    (snapshot) => {

      const data =
        snapshot.val();


      if (data) {

        pets.value =
          Object.keys(data).map(
            (key) => {

              return {
                id: key,

                name:
                  data[key].name || '',

                animalType:
                  data[key].animalType || '',

                breed:
                  data[key].breed || '',

                age:
                  Number(data[key].age) || 0,

                ownerName:
                  data[key].ownerName || '',

                notes:
                  data[key].notes || ''
              };

            }
          );

      }

      else {

        pets.value = [];

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


/* =========================
   REMOVE LISTENER
========================= */

onUnmounted(() => {

  if (unsubscribe) {
    unsubscribe();
  }

});


/* =========================
   SAVE PET
========================= */

const savePet = async () => {


  if (!form.name.trim()) {

    await showToast(
      'Please enter the pet name.',
      'warning'
    );

    return;

  }


  if (!form.animalType) {

    await showToast(
      'Please select an animal type.',
      'warning'
    );

    return;

  }


  if (!form.breed) {

    await showToast(
      'Please select a breed.',
      'warning'
    );

    return;

  }


  if (
    form.age === '' ||
    Number(form.age) < 0
  ) {

    await showToast(
      'Please enter a valid age.',
      'warning'
    );

    return;

  }


  if (!form.ownerName.trim()) {

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
      Number(form.age),

    ownerName:
      form.ownerName.trim(),

    notes:
      form.notes.trim()

  };


  try {

    /* UPDATE */

    if (editingId.value) {

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

  catch (error) {

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


/* =========================
   EDIT PET
========================= */

const editPet = async (
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
    String(pet.age);

  form.ownerName =
    pet.ownerName;

  form.notes =
    pet.notes;


  await contentRef.value?.$el.scrollToTop(
    500
  );

};


/* =========================
   DELETE CONFIRMATION
========================= */

const confirmDelete = (
  pet: Pet
) => {

  petToDelete.value =
    pet;

  deleteAlertOpen.value =
    true;

};


/* =========================
   DELETE BUTTONS
========================= */

const deleteAlertButtons = [

  {
    text: 'Cancel',
    role: 'cancel'
  },

  {
    text: 'Delete',
    role: 'destructive',

    handler: async () => {

      if (!petToDelete.value) {
        return;
      }

      await deletePet(
        petToDelete.value.id
      );

    }
  }

];


/* =========================
   DELETE PET
========================= */

const deletePet = async (
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

  catch (error) {

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


/* =========================
   RESET FORM
========================= */

const resetForm = () => {

  editingId.value =
    null;

  form.name = '';

  form.animalType = '';

  form.breed = '';

  form.age = '';

  form.ownerName = '';

  form.notes = '';

};

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.app-content {
  --background: #f5f7fb;
}

.page-container {
  width: 100%;
  max-width: 780px;

  margin: 0 auto;

  padding: 18px 16px;
}


/* =========================
   HEADER
========================= */

.modern-toolbar {
  --background:
    linear-gradient(
      135deg,
      #4f46e5,
      #6366f1,
      #7c3aed
    );

  --color: white;

  --min-height: 76px;
}

.header-content {
  display: flex;
  align-items: center;

  gap: 12px;

  padding:
    calc(env(safe-area-inset-top) + 8px)
    18px
    10px;
}

.header-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.18);

  color: white;

  font-size: 23px;
}

.header-content h1 {
  margin: 0;

  color: white;

  font-size: 20px;
  font-weight: 800;
}

.header-label {
  margin: 0 0 2px;

  color:
    rgba(255, 255, 255, 0.72);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.5px;
}


/* =========================
   HERO
========================= */

.hero-section {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 22px;

  padding: 5px 2px;
}

.hero-text {
  flex: 1;
}

.hero-eyebrow {
  margin: 0 0 6px;

  color: #6366f1;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.hero-section h2 {
  max-width: 430px;

  margin: 0;

  color: #111827;

  font-size: 27px;
  font-weight: 800;

  line-height: 1.15;
}

.hero-section h2 span {
  color: #6366f1;
}

.hero-description {
  max-width: 450px;

  margin: 9px 0 0;

  color: #6b7280;

  font-size: 14px;

  line-height: 1.5;
}


/* =========================
   PET COUNT
========================= */

.pet-count-card {
  min-width: 115px;

  padding: 15px;

  display: flex;
  align-items: center;

  gap: 10px;

  border:
    1px solid #edf0f7;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, 0.07);
}

.count-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eef2ff;

  color: #6366f1;

  font-size: 19px;
}

.count-number {
  display: block;

  color: #111827;

  font-size: 20px;
  font-weight: 800;
}

.count-label {
  display: block;

  margin-top: 1px;

  color: #9ca3af;

  font-size: 10px;
}


/* =========================
   FORM CARD
========================= */

.form-card {
  margin-bottom: 30px;

  padding: 20px;

  border:
    1px solid #edf0f7;

  border-radius: 24px;

  background: white;

  box-shadow:
    0 12px 35px
    rgba(15, 23, 42, 0.06);
}

.section-heading {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 22px;
}

.section-icon {
  width: 43px;
  height: 43px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #8b5cf6
    );

  color: white;

  font-size: 20px;
}

.section-heading h3 {
  margin: 0;

  color: #111827;

  font-size: 18px;
  font-weight: 800;
}

.section-heading p {
  margin: 4px 0 0;

  color: #9ca3af;

  font-size: 12px;
}


/* =========================
   FORM GRID
========================= */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 17px 14px;
}

.field-group {
  min-width: 0;
}

.full-width {
  grid-column: 1 / -1;
}

.field-group label {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin: 0 0 7px 3px;

  color: #374151;

  font-size: 12px;
  font-weight: 700;
}

.field-group label span {
  color: #9ca3af;

  font-size: 10px;
  font-weight: 500;
}


/* =========================
   INPUTS
========================= */

.input-wrapper,
.textarea-wrapper {
  position: relative;

  min-height: 52px;

  display: flex;
  align-items: center;

  overflow: hidden;

  border:
    1px solid #e5e7eb;

  border-radius: 15px;

  background: #f9fafb;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.input-wrapper:focus-within,
.textarea-wrapper:focus-within {
  border-color: #818cf8;

  background: white;

  box-shadow:
    0 0 0 3px
    rgba(99, 102, 241, 0.10);
}

.input-icon {
  margin-left: 15px;

  flex-shrink: 0;

  color: #9ca3af;

  font-size: 18px;
}

.textarea-icon {
  margin:
    16px 0 auto 15px;

  color: #9ca3af;

  font-size: 18px;
}

.modern-input {
  width: 100%;

  --padding-start: 12px;
  --padding-end: 14px;

  color: #111827;

  font-size: 14px;
}

.modern-textarea {
  min-height: 95px;

  --padding-start: 12px;
  --padding-end: 14px;

  --padding-top: 14px;
  --padding-bottom: 14px;

  color: #111827;

  font-size: 14px;
}


/* =========================
   CUSTOM SELECT
========================= */

.select-button {
  width: 100%;
  min-height: 52px;

  padding: 7px 14px;

  display: flex;

  align-items: center;
  justify-content: space-between;

  border:
    1px solid #e5e7eb;

  border-radius: 15px;

  background: #f9fafb;

  color: #111827;

  font-family: inherit;

  cursor: pointer;

  transition: 0.2s ease;
}

.select-button:focus {
  outline: none;

  border-color: #818cf8;

  background: white;

  box-shadow:
    0 0 0 3px
    rgba(99, 102, 241, 0.10);
}

.select-button:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

.select-left {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 11px;

  overflow: hidden;

  color: #111827;

  font-size: 14px;
  font-weight: 600;
}

.select-left > span {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.select-emoji,
.breed-icon-box {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  font-size: 19px;
}

.breed-icon-box {
  background: #eef2ff;

  color: #6366f1;

  font-size: 17px;
}

.select-placeholder {
  color: #9ca3af;

  font-weight: 400;
}

.dropdown-arrow {
  flex-shrink: 0;

  margin-left: 8px;

  color: #9ca3af;

  font-size: 18px;
}


/* =========================
   POPOVER
========================= */

:global(.custom-popover) {
  --width:
    min(
      350px,
      calc(100vw - 28px)
    );

  --max-height: 450px;

  --border-radius: 20px;

  --box-shadow:
    0 18px 45px
    rgba(15, 23, 42, 0.20);
}

:global(.custom-popover::part(content)) {
  border-radius: 20px;

  overflow: hidden;
}

.dropdown-content {
  --background: #ffffff;
}

.dropdown-header {
  padding:
    18px 18px 10px;

  border-bottom:
    1px solid #f3f4f6;
}

.dropdown-title {
  display: block;

  color: #000000 !important;

  font-size: 15px;
  font-weight: 800;
}

.dropdown-subtitle {
  display: block;

  margin-top: 3px;

  color: #6b7280;

  font-size: 11px;
}


/* =========================
   DROPDOWN OPTIONS
========================= */

.dropdown-option {
  --background: #ffffff;

  --color: #000000;

  --padding-start: 12px;
  --padding-end: 12px;

  --inner-padding-end: 4px;

  margin:
    4px 10px;

  border-radius: 14px;
}

.dropdown-option::part(native) {
  color: #000000;

  border-radius: 14px;
}

.dropdown-option-selected {
  --background: #eef2ff;
}

.option-emoji {
  width: 42px;
  height: 42px;

  margin-right: 12px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  font-size: 23px;
}

.dropdown-option ion-label {
  margin: 10px 0;

  color: #000000 !important;
}

.option-name {
  margin: 0 !important;

  color: #000000 !important;

  font-size: 13px !important;
  font-weight: 800 !important;
}

.dropdown-option ion-label p {
  margin-top: 3px;

  color: #6b7280 !important;

  font-size: 10px;
}

.selected-check {
  color: #6366f1;

  font-size: 22px;
}

.breed-option {
  min-height: 48px;
}


/* =========================
   BUTTONS
========================= */

.form-actions {
  margin-top: 22px;
}

.save-button {
  height: 50px;

  --background:
    linear-gradient(
      135deg,
      #4f46e5,
      #6366f1
    );

  --border-radius: 15px;

  --box-shadow:
    0 8px 20px
    rgba(79, 70, 229, 0.24);

  font-size: 13px;
  font-weight: 700;

  text-transform: none;
}

.cancel-button {
  margin-top: 4px;

  --color: #6b7280;

  font-size: 12px;
  font-weight: 600;

  text-transform: none;
}


/* =========================
   RECORDS
========================= */

.records-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin:
    4px 2px 14px;
}

.records-label {
  margin: 0 0 3px;

  color: #9ca3af;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.4px;
}

.records-header h3 {
  margin: 0;

  color: #111827;

  font-size: 20px;
  font-weight: 800;
}

.record-badge {
  min-width: 35px;
  height: 35px;

  padding: 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #eef2ff;

  color: #4f46e5;

  font-size: 13px;
  font-weight: 800;
}


/* =========================
   STATE
========================= */

.state-card {
  padding: 38px 20px;

  border:
    1px dashed #dfe3ec;

  border-radius: 22px;

  background: white;

  text-align: center;
}

.state-icon {
  width: 55px;
  height: 55px;

  margin:
    0 auto 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;

  background: #eef2ff;

  color: #6366f1;

  font-size: 25px;
}

.loading-icon {
  font-size: 16px;
}

.state-card h4 {
  margin: 0;

  color: #111827;

  font-size: 16px;
}

.state-card p {
  margin: 6px 0 0;

  color: #9ca3af;

  font-size: 12px;
}


/* =========================
   PET GRID
========================= */

.pets-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(290px, 1fr)
    );

  gap: 14px;
}


/* =========================
   PET CARD
========================= */

.pet-card {
  padding: 17px;

  border:
    1px solid #edf0f7;

  border-radius: 22px;

  background: white;

  box-shadow:
    0 8px 28px
    rgba(15, 23, 42, 0.055);
}

.pet-card-top {
  display: flex;
  align-items: center;

  gap: 12px;
}

.pet-avatar {
  width: 54px;
  height: 54px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 17px;

  font-size: 28px;
}

.pet-main-info {
  min-width: 0;

  flex: 1;
}

.pet-main-info h4 {
  margin: 0;

  overflow: hidden;

  color: #111827;

  font-size: 17px;
  font-weight: 800;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.pet-type {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 4px;

  overflow: hidden;

  color: #6b7280;

  font-size: 11px;

  white-space: nowrap;
}

.pet-type span:last-child {
  overflow: hidden;

  text-overflow: ellipsis;
}

.dot {
  color: #c7cbd4;
}


/* =========================
   AGE
========================= */

.age-badge {
  min-width: 43px;

  padding: 8px 9px;

  border-radius: 12px;

  background: #f3f4f6;

  color: #374151;

  text-align: center;

  font-size: 14px;
  font-weight: 800;
}

.age-badge span {
  display: block;

  margin-top: 1px;

  color: #9ca3af;

  font-size: 8px;
  font-weight: 600;
}


/* =========================
   DETAILS
========================= */

.pet-details {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin-top: 17px;

  padding: 14px 0;

  border-top:
    1px solid #f1f3f7;

  border-bottom:
    1px solid #f1f3f7;
}

.detail-row {
  display: flex;
  align-items: flex-start;

  gap: 10px;
}

.detail-icon {
  width: 31px;
  height: 31px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #f5f7fb;

  color: #6366f1;

  font-size: 15px;
}

.detail-row > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.detail-label {
  color: #9ca3af;

  font-size: 9px;
  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.6px;
}

.detail-row strong {
  color: #374151;

  font-size: 12px;
  font-weight: 600;
}

.notes-text {
  line-height: 1.4;
}


/* =========================
   ACTIONS
========================= */

.pet-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 11px;
}

.edit-button,
.delete-button {
  height: 38px;

  margin: 0;

  border-radius: 11px;

  font-size: 11px;
  font-weight: 700;

  text-transform: none;
}

.edit-button {
  --color: #4f46e5;

  background: #eef2ff;
}

.delete-button {
  --color: #dc2626;

  background: #fef2f2;
}


/* =========================
   ANIMAL COLORS
========================= */

.animal-dog {
  background: #fff7ed;
}

.animal-cat {
  background: #faf5ff;
}

.animal-bird {
  background: #eff6ff;
}

.animal-rabbit {
  background: #fff1f2;
}

.animal-fish {
  background: #ecfeff;
}

.animal-other {
  background: #f3f4f6;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .page-container {
    padding:
      14px 13px;
  }

  .hero-section {
    flex-direction: column;

    align-items: stretch;

    gap: 14px;
  }

  .hero-section h2 {
    font-size: 24px;
  }

  .pet-count-card {
    align-self: flex-start;

    min-width: 150px;
  }

  .form-card {
    padding: 17px;

    border-radius: 21px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .pets-grid {
    grid-template-columns: 1fr;
  }

}


/* =========================
   SMALL PHONE
========================= */

@media (max-width: 370px) {

  .header-content {
    padding-left: 13px;
    padding-right: 13px;
  }

  .hero-section h2 {
    font-size: 22px;
  }

  .pet-card {
    padding: 14px;
  }

  .pet-avatar {
    width: 48px;
    height: 48px;

    font-size: 24px;
  }

}


.bottom-space {
  height: 25px;
}

</style>