function sortCompleted (a, b) {
    if (a.completed && !b.completed) {
        return 1;
    } else if (!a.completed && b.completed) {
        return - 1;
    } else {
        return 0;
    }
}

export {sortCompleted}