export class SelectProject {
    constructor(params, index) {
        this.label = params.name;
        this.value = params.name;
        this.key = index;
        this.client = { ...params.client };
        this.client_id = params.client_id
        this.created_at = params.created_at 
        this.deleted_at = params.deleted_at
        this.description = params.description 
        this.id = params.id 
        this.name = params.name 
        this.updated_at = params.updated_at 
    }
}

export class SelectTrackers {
    constructor(params, index) {
        this.id = params.id;
        this.slug = params.slug;
        this.timeless = params.timeless;
        this.title = params.title;
        this.label = params.title;
        this.value = params.title;
        this.key = index;
    }
}
