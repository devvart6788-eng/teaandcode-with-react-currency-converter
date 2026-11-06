import { useEffect, useState } from 'react'

function useCurrencyInfo(currency) {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()
        const baseCurrency = currency?.toLowerCase() || 'usd'
        const endpoints = [
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`,
            `https://latest.currency-api.pages.dev/v1/currencies/${baseCurrency}.json`,
        ]

        async function fetchRates() {
            setLoading(true)
            setError('')

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, {
                        signal: controller.signal,
                    })

                    if (!response.ok) {
                        throw new Error(`Request failed: ${response.status}`)
                    }

                    const result = await response.json()
                    if (!result[baseCurrency]) {
                        throw new Error(`No rates found for ${baseCurrency.toUpperCase()}`)
                    }

                    setData(result[baseCurrency])
                    return
                } catch (fetchError) {
                    if (fetchError.name === 'AbortError') return
                }
            }

            setData({})
            setError('Unable to load exchange rates. Please try again.')
        }

        fetchRates().finally(() => {
            if (!controller.signal.aborted) setLoading(false)
        })

        return () => controller.abort()
    }, [currency])

    return { data, loading, error }
}

export default useCurrencyInfo
