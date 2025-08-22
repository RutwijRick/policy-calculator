export const differenceInYears = (to, from) => {
    let years = to.getFullYear() - from.getFullYear();
    const m = to.getMonth() - from.getMonth();
    if (m < 0 || (m === 0 && to.getDate() < from.getDate())) years--;
    return years;
};
