import companyAPI from '@/services/api/company'
import cityAPI from '@/services/api/city'
import router from '../../router'

const module = {
  namespaced: true,
  state: {
    button_loading: false,                    // loading status
    isTableLoading: false,

    error: null,
    
    data: [],                                 // companies
    customerAdmins: [],
    companies: [],

    customerAccount: null,                    
    customerProfile: null
  },

  actions: {
    initAddCompany({
      commit
    }) {
      companyAPI.initAddCompany().then((response) => {
        commit('SET_COMPANIES', response.data.companies)
      })
    },
    getCustomers({
      commit
    }) {
      commit('TABLE_LOAD')
      companyAPI.getCustomers().then((response) => {
        commit('SET_CUSTOMER_ADMINS', response.data.customer_admins)
      })
        .catch(() => {

        })
        .finally(() => {
          commit('TABLE_LOADED')
        })
    },
    addCustomer({
      commit, dispatch
    }, data) {
      commit('BUTTON_LOAD')

      companyAPI.addCustomer(data).then((response) => {
        commit('CLEAR_ERROR')
        dispatch('app/showSuccess', response.data, { root: true })
        router.push({
          name: 'customers-list'
        })
      })
        .catch((error) => {
          if (error.response.status === 422) {
            if (error.response.data.error.administrator_email) {
              commit('SET_ERROR', {
                'error': `Customer administrator for company <i>${data.companyName}</i> already exists`
              })
            } else {
              const errors = Object.values(error.response.data.error).flat()

              commit('SET_ERROR', {
                'error': errors[0]
              })
            }
          }
        })
        .finally(() => {
          commit('BUTTON_CLEAR')
        })
    },
    getCustomer({
      commit
    }, id) {
      companyAPI.getCustomer(id).then((response) => {
        commit('SET_CUSTOMER_ACCOUNT', response.data.customer)
        commit('SET_CUSTOMER_PROFILE', response.data.profile)
        commit('SET_COMPANIES', response.data.companies)
        commit('cities/SET_DATA', response.data.cities, { root: true } )
      })
        .catch((error) => {
          console.log(error.response.data)
        })
    },
    updateAccount({
      commit, dispatch
    }, account) {
      commit('BUTTON_LOAD')
      companyAPI.updateAccount(account).then((response) => {
        dispatch('app/showSuccess', response.data, { root: true })
        router.push({
          name: 'customers-list'
        })
      })
        .catch((error) => {
          if (error.response.status === 422) {
            if (error.response.data.error.administrator_email) {
              commit('SET_ERROR', {
                'error': `Customer administrator for company <i>${account.companyName}</i> already exists`
              })
            } else {
              const errors = Object.values(error.response.data.error).flat()

              commit('SET_ERROR', {
                'error': errors[0]
              })
            }
          }
        })
        .finally(() => {
          commit('BUTTON_CLEAR')
        })
    },
    updateProfile({
      commit, dispatch
    }, data) {
      commit('BUTTON_LOAD')
      companyAPI.updateProfile(data).then((response) => {
        dispatch('app/showSuccess', response.data, { root: true })
        router.push({
          name: 'customers-list'
        })
      })
        .finally(() => {
          commit('BUTTON_CLEAR')
        })
    },
    getCities({
      commit, dispatch
    }, state) {
      return new Promise((resolve, reject) => {
        cityAPI.getCities(state).then((response) => {
          commit('cities/SET_DATA', response.data, { root: true })
          resolve(response)
        })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            // commit('BUTTON_CLEAR')
          })
      })
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  },

  mutations: {
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },

    // BUTTON load
    BUTTON_LOAD(state) {
      state.button_loading = true
    },

    BUTTON_CLEAR(state) {
      state.button_loading = false
    },

    TABLE_LOAD(state) {
      state.isTableLoading = true
    },

    TABLE_LOADED(state) {
      state.isTableLoading = false
    },

    SET_CUSTOMERS(state, customers) {
      state.data = customers
    },

    SET_COMPANIES(state, companies) {
      state.companies = companies
    },

    SET_CUSTOMER_ADMINS(state, customerAdmins) {
      state.customerAdmins = customerAdmins
    },

    SET_CUSTOMER_ACCOUNT(state, customerAccount) {
      state.customerAccount = customerAccount
    },
    SET_CUSTOMER_PROFILE(state, customerProfile) {
      state.customerProfile = customerProfile
    }
  },

  getters: {
    extendedCompanies: (state) => {
      const _companies = state.data.slice()

      _companies.unshift({
        id: 0,
        name: 'Not Assigned'
      })

      return _companies
    }
  }
}

export default module