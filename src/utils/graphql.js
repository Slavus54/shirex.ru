export const onGetComponent = (getComponent, id) => {
    getComponent({
        variables: {
            id
        }
    })
}