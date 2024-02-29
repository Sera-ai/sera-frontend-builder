export const newNodeDefault = (type, id) => {
    const typeMapping = {
        "integerNode": "integer",
        "stringNode": "string",
        "arrayNode": "array",
    };

    const functionType = typeMapping[type];

    if (!functionType) return;

    return {
        function: functionType,
        target: { id: null, type: null, title: null },
        source: { id: null, type: null, title: null },
        nodeType: 0,
        inputData: null,
        id: id
    };
};

export const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}