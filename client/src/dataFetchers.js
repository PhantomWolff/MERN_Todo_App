// Here ye shall find all the fetchers
export const fetchGetItems = async ({setIsLoading, setTodos}) => {
    setIsLoading(true);
    let res = await fetch('/api/items');
    let data = await res.json();
    setTodos(data);
    setIsLoading(false);
};

export const fetchAddItem = async ({setIsLoading, newTodo}) => {
    setIsLoading(true);
    const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
    });
    setIsLoading(false);
    return res;
};

export const fetchDeleteItem = async ({setIsLoading, id}) => {
    setIsLoading(true);
    await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({id: id})
    });
    setIsLoading(false);
};

export const fetchUpdateItem = async ({setIsLoading, newTodo, _id}) => {
    setIsLoading(true);
    await fetch(`/api/items/update/${_id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
    });
    setIsLoading(false);
};