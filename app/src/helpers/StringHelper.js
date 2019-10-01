export let capitalize = (string, lower = false) => {
    return (lower ? string.toLowerCase() : string).replace(/(?:^|\s)\S/g, function(
        a
    ) {
        return a.toUpperCase();
    });
};
