import { supabase } from '../lib/supabase.js'

export async function removeDuplicateEvents() {
    try {
        // 1. Obtener todos los eventos
        const { data: events, error: fetchError } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        if (!events || events.length === 0) {
            return {
                success: true,
                message: 'No hay eventos para procesar'
            }
        }

        // 2. Agrupar por nombre y mantener solo el más reciente
        const uniqueEvents = {}
        const duplicateIds = []

        events.forEach(event => {
            if (!uniqueEvents[event.name]) {
                uniqueEvents[event.name] = event
            } else {
                duplicateIds.push(event.id)
            }
        })

        if (duplicateIds.length === 0) {
            return {
                success: true,
                message: 'No se encontraron eventos duplicados'
            }
        }

        // 3. Eliminar los duplicados uno por uno
        for (const id of duplicateIds) {
            const { error: deleteError } = await supabase
                .from('events')
                .delete()
                .eq('id', id)

            if (deleteError) {
                console.error(`Error al eliminar evento ${id}:`, deleteError)
            }
        }

        return {
            success: true,
            message: `Se eliminaron ${duplicateIds.length} eventos duplicados`
        }
    } catch (error) {
        console.error('Error al eliminar duplicados:', error)
        return {
            success: false,
            message: 'Error al eliminar duplicados',
            error: error.message
        }
    }
}
