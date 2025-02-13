// Mapeo de meses en inglés a español
const monthsMap = {
  'Jan': 'Enero',
  'Feb': 'Febrero',
  'Mar': 'Marzo',
  'Apr': 'Abril',
  'May': 'Mayo',
  'Jun': 'Junio',
  'Jul': 'Julio',
  'Aug': 'Agosto',
  'Sep': 'Septiembre',
  'Oct': 'Octubre',
  'Nov': 'Noviembre',
  'Dec': 'Diciembre'
}

// Mapeo de días en inglés a español
const daysMap = {
  'Mon': 'Lunes',
  'Tue': 'Martes',
  'Wed': 'Miércoles',
  'Thu': 'Jueves',
  'Fri': 'Viernes',
  'Sat': 'Sábado',
  'Sun': 'Domingo',
  // Agregar variaciones comunes que puedan aparecer
  'Monday': 'Lunes',
  'Tuesday': 'Martes',
  'Wednesday': 'Miércoles',
  'Thursday': 'Jueves',
  'Friday': 'Viernes',
  'Saturday': 'Sábado',
  'Sunday': 'Domingo',
  'Marzotes': 'Martes', // Corregir error específico
  'Sábadourday': 'Sábado' // Corregir error específico
}

export function translateDateToSpanish(dateStr) {
  if (!dateStr) return '';
  
  // Limpiar la cadena de texto primero
  let translatedStr = dateStr.trim();
  
  // Si la fecha ya está completamente en español y en formato correcto, la devolvemos
  if (/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),?\s+\d{1,2}\s+de\s+(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)/.test(translatedStr)) {
    return translatedStr;
  }

  // Traducir "at" a "a las"
  translatedStr = translatedStr.replace(' at ', ' a las ');

  // Traducir días
  Object.entries(daysMap).forEach(([eng, esp]) => {
    const regex = new RegExp(eng, 'gi');
    translatedStr = translatedStr.replace(regex, esp);
  });

  // Traducir meses
  Object.entries(monthsMap).forEach(([eng, esp]) => {
    const regex = new RegExp(eng, 'gi');
    translatedStr = translatedStr.replace(regex, esp);
  });

  // Convertir AM/PM a formato 24h
  if (translatedStr.includes('PM')) {
    const timeStr = translatedStr.match(/\d{1,2}:\d{2}/)?.[0];
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const hour24 = (parseInt(hours) + 12).toString();
      translatedStr = translatedStr.replace(timeStr + ' PM', hour24 + ':' + minutes + ' hs');
    }
  } else if (translatedStr.includes('AM')) {
    translatedStr = translatedStr.replace(' AM', ' hs');
  }

  // Limpiar cualquier texto residual en inglés
  translatedStr = translatedStr.replace('urday', '');
  translatedStr = translatedStr.replace('zotes', '');

  // Formatear la fecha al estilo español si tiene el formato "Día, Mes DD"
  const dateMatch = translatedStr.match(/([A-Za-zá-úÁ-Ú]+),?\s+([A-Za-zá-úÁ-Ú]+)\s+(\d{1,2})/);
  if (dateMatch) {
    const [_, dia, mes, numero] = dateMatch;
    translatedStr = translatedStr.replace(
      dateMatch[0],
      `${dia} ${numero} de ${mes}`
    );
  }

  return translatedStr;
}
