<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Pet Information Manager</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content class="ion-padding">

      <!-- ============================= -->
      <!-- ADD / EDIT PET FORM -->
      <!-- ============================= -->

      <ion-card>

        <ion-card-header>

          <ion-card-title>
            {{ editingId ? 'Edit Pet Information' : 'Add Pet Information' }}
          </ion-card-title>

          <ion-card-subtitle>
            Fill in the pet information below.
          </ion-card-subtitle>

        </ion-card-header>


        <ion-card-content>

          <!-- PET NAME -->
          <ion-item>
            <ion-input
              v-model="form.name"
              label="Pet Name"
              label-placement="stacked"
              placeholder="Enter pet name"
            />
          </ion-item>


          <!-- ANIMAL TYPE -->
          <ion-item>

            <ion-select
              v-model="form.animalType"
              label="Animal Type"
              label-placement="stacked"
              placeholder="Select animal type"
            >

              <ion-select-option value="Dog">
                Dog
              </ion-select-option>

              <ion-select-option value="Cat">
                Cat
              </ion-select-option>

              <ion-select-option value="Bird">
                Bird
              </ion-select-option>

              <ion-select-option value="Rabbit">
                Rabbit
              </ion-select-option>

              <ion-select-option value="Fish">
                Fish
              </ion-select-option>

              <ion-select-option value="Other">
                Other
              </ion-select-option>

            </ion-select>

          </ion-item>


          <!-- BREED -->
          <ion-item>
            <ion-input
              v-model="form.breed"
              label="Breed"
              label-placement="stacked"
              placeholder="Enter breed"
            />
          </ion-item>


          <!-- AGE -->
          <ion-item>
            <ion-input
              v-model="form.age"
              type="number"
              min="0"
              label="Age"
              label-placement="stacked"
              placeholder="Enter age"
            />
          </ion-item>


          <!-- OWNER NAME -->
          <ion-item>
            <ion-input
              v-model="form.ownerName"
              label="Owner Name"
              label-placement="stacked"
              placeholder="Enter owner name"
            />
          </ion-item>


          <!-- NOTES -->
          <ion-item>
            <ion-textarea
              v-model="form.notes"
              label="Notes"
              label-placement="stacked"
              placeholder="Enter notes about the pet"
              :auto-grow="true"
            />
          </ion-item>


          <!-- ADD / UPDATE BUTTON -->
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="savePet"
          >

            {{ editingId ? 'Update Pet' : 'Add Pet' }}

          </ion-button>


          <!-- CANCEL EDIT BUTTON -->
          <ion-button
            v-if="editingId"
            expand="block"
            fill="outline"
            color="medium"
            @click="resetForm"
          >

            Cancel Edit

          </ion-button>

        </ion-card-content>

      </ion-card>


      <!-- ============================= -->
      <!-- PET LIST -->
      <!-- ============================= -->

      <h2 class="section-title">
        Pet Records
      </h2>


      <!-- LOADING -->

      <div
        v-if="loading"
        class="loading-container"
      >

        <ion-spinner name="crescent" />

        <p>
          Loading pet records...
        </p>

      </div>


      <!-- NO PETS -->

      <ion-card
        v-else-if="pets.length === 0"
      >

        <ion-card-content class="ion-text-center">

          No pet records found.

        </ion-card-content>

      </ion-card>


      <!-- PET CARDS -->

      <ion-card
        v-for="pet in pets"
        :key="pet.id"
      >

        <ion-card-header>

          <ion-card-title>
            {{ pet.name }}
          </ion-card-title>

          <ion-card-subtitle>

            {{ pet.animalType }}

            <span v-if="pet.breed">
              • {{ pet.breed }}
            </span>

          </ion-card-subtitle>

        </ion-card-header>


        <ion-card-content>

          <p>
            <strong>Age:</strong>
            {{ pet.age }}
          </p>

          <p>
            <strong>Owner:</strong>
            {{ pet.ownerName }}
          </p>

          <p>
            <strong>Notes:</strong>
            {{ pet.notes || 'No notes provided.' }}
          </p>


          <div class="action-buttons">

            <!-- EDIT -->

            <ion-button
              size="small"
              color="warning"
              @click="editPet(pet)"
            >

              Edit

            </ion-button>


            <!-- DELETE -->

            <ion-button
              size="small"
              color="danger"
              @click="confirmDelete(pet)"
            >

              Delete

            </ion-button>

          </div>

        </ion-card-content>

      </ion-card>


      <!-- ============================= -->
      <!-- DELETE CONFIRMATION -->
      <!-- ============================= -->

      <ion-alert
        :is-open="deleteAlertOpen"
        header="Delete Pet"
        :message="
          `Are you sure you want to delete ${
            petToDelete?.name || 'this pet'
          }?`
        "
        :buttons="deleteAlertButtons"
        @didDismiss="deleteAlertOpen = false"
      />

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

/* =========================================
   IONIC IMPORTS
========================================= */

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonAlert,
  IonSpinner,
  toastController
} from '@ionic/vue';


/* =========================================
   VUE IMPORTS
========================================= */

import {
  reactive,
  ref,
  onMounted,
  onUnmounted
} from 'vue';


/* =========================================
   FIREBASE REALTIME DATABASE
========================================= */

import {
  ref as databaseRef,
  push,
  onValue,
  update,
  remove
} from 'firebase/database';


import { db } from '../firebase';


/* =========================================
   PET INTERFACE
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


/* =========================================
   VARIABLES
========================================= */

const pets = ref<Pet[]>([]);

const loading = ref(true);

const editingId = ref<string | null>(null);

const deleteAlertOpen = ref(false);

const petToDelete = ref<Pet | null>(null);


/* =========================================
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


/* =========================================
   TOAST
========================================= */

const showToast = async (
  message: string,
  color: string = 'success'
) => {

  const toast = await toastController.create({

    message: message,

    duration: 2000,

    color: color,

    position: 'bottom'

  });


  await toast.present();

};


/* =========================================
   READ PETS
========================================= */

let unsubscribe: (() => void) | null = null;


onMounted(() => {

  const petsRef = databaseRef(
    db,
    'pets'
  );


  unsubscribe = onValue(

    petsRef,

    (snapshot) => {

      const data = snapshot.val();


      if (data) {

        pets.value = Object.keys(data).map(
          (key) => {

            return {

              id: key,

              name: data[key].name || '',

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


      loading.value = false;

    },

    async (error) => {

      console.error(
        'Firebase read error:',
        error
      );


      loading.value = false;


      await showToast(
        'Unable to load pet records.',
        'danger'
      );

    }

  );

});


/* =========================================
   REMOVE LISTENER
========================================= */

onUnmounted(() => {

  if (unsubscribe) {

    unsubscribe();

  }

});


/* =========================================
   CREATE / UPDATE
========================================= */

const savePet = async () => {


  /* PET NAME VALIDATION */

  if (!form.name.trim()) {

    await showToast(
      'Please enter the pet name.',
      'warning'
    );

    return;

  }


  /* ANIMAL TYPE VALIDATION */

  if (!form.animalType) {

    await showToast(
      'Please select an animal type.',
      'warning'
    );

    return;

  }


  /* BREED VALIDATION */

  if (!form.breed.trim()) {

    await showToast(
      'Please enter the breed.',
      'warning'
    );

    return;

  }


  /* AGE VALIDATION */

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


  /* OWNER VALIDATION */

  if (!form.ownerName.trim()) {

    await showToast(
      'Please enter the owner name.',
      'warning'
    );

    return;

  }


  /* DATA TO SAVE */

  const petData = {

    name:
      form.name.trim(),

    animalType:
      form.animalType,

    breed:
      form.breed.trim(),

    age:
      Number(form.age),

    ownerName:
      form.ownerName.trim(),

    notes:
      form.notes.trim()

  };


  try {


    /* =====================================
       UPDATE PET
    ===================================== */

    if (editingId.value) {

      const petRef = databaseRef(
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


    /* =====================================
       CREATE PET
    ===================================== */

    else {

      const petsRef = databaseRef(
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


/* =========================================
   EDIT PET
========================================= */

const editPet = (pet: Pet) => {

  editingId.value = pet.id;


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


  /* Scroll back to form */

  window.scrollTo({

    top: 0,

    behavior: 'smooth'

  });

};


/* =========================================
   DELETE CONFIRMATION
========================================= */

const confirmDelete = (pet: Pet) => {

  petToDelete.value = pet;

  deleteAlertOpen.value = true;

};


/* =========================================
   ALERT BUTTONS
========================================= */

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


/* =========================================
   DELETE PET
========================================= */

const deletePet = async (
  id: string
) => {

  try {

    const petRef = databaseRef(
      db,
      `pets/${id}`
    );


    await remove(
      petRef
    );


    petToDelete.value = null;


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


/* =========================================
   RESET FORM
========================================= */

const resetForm = () => {

  editingId.value = null;


  form.name = '';

  form.animalType = '';

  form.breed = '';

  form.age = '';

  form.ownerName = '';

  form.notes = '';

};

</script>


<style scoped>

.section-title {

  max-width: 700px;

  margin: 25px auto 10px auto;

  font-weight: bold;

}


ion-card {

  max-width: 700px;

  margin-left: auto;

  margin-right: auto;

}


.loading-container {

  text-align: center;

  padding: 30px;

}


.loading-container p {

  margin-top: 10px;

}


.action-buttons {

  display: flex;

  gap: 8px;

  margin-top: 15px;

}

</style>