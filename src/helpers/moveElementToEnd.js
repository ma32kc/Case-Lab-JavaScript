function moveElementToEnd(arr, element) {
    const index = arr.indexOf(element);

    if (index !== -1) {
        arr.splice(index, 1);
        arr.push(element);
    }
}

export {moveElementToEnd}