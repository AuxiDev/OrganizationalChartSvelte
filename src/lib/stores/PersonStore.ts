import type { ChartPerson } from '$types/chart';
import { writable, get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const personStore = writable<ChartPerson[]>([]);

const editPerson = (id: string, newData: ChartPerson) => {
	let personToEdit;
	personStore.update((persons) => {
		personToEdit = persons.find((person) => person.id === id);
		if (personToEdit) {
			personToEdit.name = newData.name;
			personToEdit.description = newData.description;
			personToEdit.image = newData.image;
		}

		return persons;
	});

	return personToEdit;
};

const deletePerson = (id: string) => {
	personStore.update((persons) => persons.filter((person) => person.id !== id));
};

const createPerson = (name: string, description?: string, image?: string, id?: string) => {
	let createdPerson = { id: id ? id : uuidv4(), name, description, image };
	personStore.update((persons) => {
		persons.push(createdPerson);
		return persons;
	});

	return createdPerson;
};

const findPerson = (id: string) => {
	return get(personStore).filter((person) => person.id === id)[0];
};

export { editPerson, deletePerson, createPerson, personStore, findPerson };
