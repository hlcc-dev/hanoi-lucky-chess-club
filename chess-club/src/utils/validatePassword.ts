function validatePassword(password: string): boolean {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const isValid = passwordRegex.test(password)
    return isValid
}

export default validatePassword