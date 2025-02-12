import { removeDuplicateEvents } from '../src/utils/removeDuplicates.js'

async function main() {
    console.log('Iniciando limpieza de eventos duplicados...')
    const result = await removeDuplicateEvents()
    console.log(result.message)
    if (!result.success) {
        console.error('Error:', result.error)
        process.exit(1)
    }
    process.exit(0)
}

main()
