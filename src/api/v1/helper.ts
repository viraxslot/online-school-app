export class Helper {
    /**
     * Remove fields from the object
     * @param user 
     * @param fields 
     */
    static removeRedundantFields(user: any, fields: string[]): void {
        fields.forEach(field => {
            delete user[field]
        })
    }
}