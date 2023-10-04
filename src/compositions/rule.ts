const useRule = () => {
  const required = (value: string | null | undefined): Boolean => !!value

  const notRequired = (value: string | null | undefined): Boolean => !!value || !value

  const requiredNumber = (value: number | undefined): Boolean =>
    value ? value !== undefined : true

  const displayNameLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const nameLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const emailFormat = (value: string): Boolean =>
    value ? !!value.match(/[\w\-._]+@[\w\-._]+\.[A-Za-z]+/) : true

  const passwordFormat = (value: string): Boolean =>
    value ? !!value.match(/^([a-zA-Z0-9]{8,})$/) : true

  const workTitleLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const workDescriptionLength = (value: string): Boolean => (value ? value.length <= 250 : true)

  const episodeNumLength = (value: string): Boolean => (value ? value.length <= 20 : true)

  const episodeTitleLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const episodePriceMin = (value: number): Boolean => (value ? value >= 0 : true)

  const check = (value: boolean): Boolean => value

  const memoLength = (value: string): Boolean => (value ? value.length <= 300 : true)

  const requiredUploadFile = (value: File[]): Boolean => (value ? value.length === 1 : true)

  const accountNameFormat = (value: string): Boolean =>
    value ? !!value.match(/^[ァ-ー]+$/) && value.length <= 100 : true

  const financialInstitutionNameLength = (value: string): Boolean =>
    value ? value.length <= 50 : true

  const branchNameLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const accountNumberFormat = (value: string): Boolean =>
    value ? !!value.match(/^[0-9]+$/) && value.length <= 8 : true

  const phoneNumberFormat = (value: string): Boolean =>
    value ? !!value.match(/^[0-9]+$/) && value.length <= 11 : true

  const episodePriceFormat = (value: number): Boolean => (value ? value <= 99999 : true)

  const prLength = (value: string): Boolean => (value ? value.length <= 250 : true)

  const inquiryNameLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const inquiryEmailFormat = (value: string): Boolean =>
    value ? !!value.match(/[\w\-._]+@[\w\-._]+\.[A-Za-z]+/) : true

  const inquirySubjectLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const inquiryContentLength = (value: string): Boolean => (value ? value.length <= 1000 : true)

  const commissionTitleLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  const commissionPriceFormat = (value: number): Boolean => (value ? value <= 999999 : true)

  const commissionDescriptionLength = (value: string): Boolean =>
    value ? value.length <= 2000 : true

  const commissionWorkPeriodLength = (value: string): Boolean => (value ? value.length <= 50 : true)

  return {
    required,
    notRequired,
    requiredNumber,
    displayNameLength,
    nameLength,
    emailFormat,
    passwordFormat,
    workTitleLength,
    workDescriptionLength,
    episodeNumLength,
    episodeTitleLength,
    episodePriceMin,
    check,
    memoLength,
    requiredUploadFile,
    accountNameFormat,
    financialInstitutionNameLength,
    branchNameLength,
    accountNumberFormat,
    phoneNumberFormat,
    episodePriceFormat,
    prLength,
    inquiryNameLength,
    inquiryEmailFormat,
    inquirySubjectLength,
    inquiryContentLength,
    commissionTitleLength,
    commissionPriceFormat,
    commissionDescriptionLength,
    commissionWorkPeriodLength,
  }
}

export type RuleStore = ReturnType<typeof useRule>
export { useRule }
