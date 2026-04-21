<template>
  <div class="p-6 max-w-5xl mx-auto text-left">
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Manage Infrastructure</h1>

    <!-- Form Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        {{ isEditing ? 'Edit Infrastructure' : 'Add New Infrastructure' }}
      </h2>
      <form @submit.prevent="saveInfrastructure" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <select v-model="form.type" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border">
            <option value="Nginx">Nginx</option>
            <option value="DB">DB</option>
            <option value="Server">Server</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
          <input v-model="form.url" type="url" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select v-model="form.status" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="col-span-1 md:col-span-2 flex justify-end mt-2">
          <button v-if="isEditing" type="button" @click="resetForm" class="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">URL</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="item in infrastructures" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': item.type === 'DB',
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': item.type === 'Server',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': item.type === 'Nginx'
              }">
                {{ item.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.url }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <span :class="item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editInfrastructure(item)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 mr-3">Edit</button>
              <button @click="deleteInfrastructure(item.id)" class="text-red-600 dark:text-red-400 hover:text-red-900">Delete</button>
            </td>
          </tr>
          <tr v-if="infrastructures.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No infrastructure records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const infrastructures = ref([])

const form = reactive({
  id: null,
  name: '',
  type: 'Server',
  url: '',
  status: 'Active'
})

const isEditing = ref(false)
const apiUrl = 'http://192.168.101.58:5000/api/infrastructure'

const fetchInfrastructures = async () => {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    infrastructures.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const resetForm = () => {
  form.id = null
  form.name = ''
  form.type = 'Server'
  form.url = ''
  form.status = 'Active'
  isEditing.value = false
}

const saveInfrastructure = async () => {
  try {
    if (isEditing.value) {
      await fetch(`${apiUrl}/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          url: form.url,
          status: form.status
        })
      })
    } else {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          url: form.url,
          status: form.status
        })
      })
    }
    resetForm()
    await fetchInfrastructures()
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const editInfrastructure = (item) => {
  form.id = item.id
  form.name = item.name
  form.type = item.type
  form.url = item.url
  form.status = item.status
  isEditing.value = true
}

const deleteInfrastructure = async (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      })
      await fetchInfrastructures()
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }
}

onMounted(() => {
  fetchInfrastructures()
})
</script>
