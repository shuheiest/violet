import aspida from '@aspida/fetch'
import $api from '@violet/api/api/$api'
import { createContext, useCallback, useMemo, useState } from 'react'

export const ApiContext = createContext({
  api: $api(aspida()),
  setToken: (() => {}) as (token: string) => void,
  deleteToken: () => {},
})

export const ApiProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState('')
  const api = useMemo(
    () => $api(token ? aspida(fetch, { headers: { Authorization: `Bearer ${token}` } }) : aspida()),
    [token]
  )
  const deleteToken = useCallback(() => setToken(''), [])

  return (
    <ApiContext.Provider value={{ api, setToken, deleteToken }}>{children}</ApiContext.Provider>
  )
}
