import {createContext} from 'react';

const UserContext = createContext({
    user: {
        name: 'John',
        lastname: 'Doe',
    },
    updateName: () => {},
    updateLastname: () => {},
});

export default UserContext;