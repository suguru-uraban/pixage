import firebase from '@/plugins/firebase'

// 配列を引数に設定した数値分分割する関数
// firestoreでは配列は一度のクエリで10までしか取得できないため（大抵引数に設定するのは10）
export const sliceByNumber = (array: number[], number: number) => {
  const length = Math.ceil(array.length / number)
  return new Array(length).fill(null).map((_, i) => array.slice(i * number, (i + 1) * number))
}

// 容量を計算する関数
export const convertFileSize = (size: number, decimal = 2) => {
  const { target, unit } = getTarget(size)
  const d = Math.pow(10, decimal)

  const newSize = target !== null ? Math.floor((size / target) * d) / d : size

  return newSize + unit
}

// 入力されたファイルサイズを元に計算につかうバイト数と単位を返却
const getTarget = (size: number) => {
  const kb = 1024
  const mb = Math.pow(kb, 2)
  const gb = Math.pow(kb, 3)
  const tb = Math.pow(kb, 4)

  if (size >= tb) return { target: tb, unit: 'TB' }
  if (size >= gb) return { target: gb, unit: 'GB' }
  if (size >= mb) return { target: mb, unit: 'MB' }
  if (size >= kb) return { target: kb, unit: 'KB' }

  return { target: null, unit: 'byte' }
}

// firestoreのtimestampをyyyy/mm/dd hh:mmに変換
export const convertTimestampForDate = (timestamp: firebase.firestore.Timestamp) => {
  const convertDate = timestamp.toDate()
  const year = convertDate.getFullYear()
  const month = ('0' + (convertDate.getMonth() + 1)).slice(-2)
  const date = ('0' + convertDate.getDate()).slice(-2)
  const hour = ('0' + convertDate.getHours()).slice(-2)
  const minutes = ('0' + convertDate.getMinutes()).slice(-2)
  return `${year}/${month}/${date} ${hour}:${minutes}`
}

// firestoreのtimestampをミリ秒に変換
export const convertTimestampForDateTime = (timestamp: firebase.firestore.Timestamp) => {
  const convertDate = timestamp.toDate()
  return convertDate.getTime()
}

// 配列の数値の最大を取得する関数
export const getArrayMax = (array: number[]) => {
  const aryMax = (a: number, b: number) => {
    return Math.max(a, b)
  }
  return array.reduce(aryMax)
}

// 購入日の七日後の23:59を取得する関数
export const getSevenDaysLater = (timestamp: string) => {
  const additionalTime = 7 * 24 * 60 * 60 * 1000
  return timestamp + additionalTime
}

// 読める期間を取得
export const getReadingPeriod = (timestamp: string) => {
  const year = new Date(getSevenDaysLater(timestamp)).getFullYear()
  const month = new Date(getSevenDaysLater(timestamp)).getMonth() + 1
  const date = new Date(getSevenDaysLater(timestamp)).getDate()
  const hour = new Date(getSevenDaysLater(timestamp)).getHours()
  const minutes = ('0' + new Date(getSevenDaysLater(timestamp)).getMinutes()).slice(-2)
  return `${year}年${month}月${date}日 ${hour}時${minutes}分まで`
}

// Pixageの手数料を引いた額を取得（クリエイターが一人かつ公式作品ではない場合）
export const getAmountMinusFees = (bill: number) => bill - Math.ceil(bill * 0.3)

// Pixageの手数料を引いた額を取得（クリエイターが二人かつ公式作品ではない場合）
export const getMultiAmountMinusFees = (bill: number) => bill - Math.ceil(bill * 0.15)

// Pixageの手数料を引いた額を取得（クリエイターが一人かつ公式作品の場合）
export const getAmountMinusOfficialFees = (bill: number) => bill - Math.ceil(bill * 0.7)

// Pixageの手数料を引いた額を取得（クリエイターが二人かつ公式作品の場合）
export const getMultiAmountMinusOfficialFees = (bill: number) => bill - Math.ceil(bill * 0.35)

// 月初の日付を取得（未使用）
// export const getBeginMonth = (date: Date) => {
//   date.setDate(1)
//   return date
// }

// 月末の日付を取得（未使用）
// export const getEndMonth = (date: Date) => {
//   date.setMonth(date.getMonth() + 1)
//   date.setDate(0)
//   return date
// }
