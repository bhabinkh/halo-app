export const generateRandomNumber = (length: number) => {
    let randomNum =
        (Math.pow(10, length).toString().slice(length - 1) +
            Math.floor((Math.random() * Math.pow(10, length)) + 1).toString()).slice(-length);
    return randomNum;
}
