import type { ChartPerson } from '$types/chart';
import { writable, get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const personStore = writable<ChartPerson[]>([]);

const editPerson = (id: string, newData: ChartPerson) => {
	personStore.update((persons) => {
		let personToEdit = persons.find((person) => person.id === id);
		if (personToEdit) {
			personToEdit.name = newData.name;
			personToEdit.description = newData.description;
			personToEdit.image = newData.image;
		}

		return persons;
	});
};

const deletePerson = (id: string) => {
	personStore.update((persons) => persons.filter((person) => person.id !== id));
};

const createPerson = (name: string, description?: string, image?: string) => {
	personStore.update((persons) => {
		persons.push({ id: uuidv4(), name, description, image });
		return persons;
	});
};

export { editPerson, deletePerson, createPerson, personStore };
