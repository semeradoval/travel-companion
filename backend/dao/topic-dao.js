const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORAGE_PATH = path.join(__dirname, '..', 'storage', 'topics.json');

function readAll() {
	const raw = fs.readFileSync(STORAGE_PATH, 'utf-8');
	return JSON.parse(raw);
}

function writeAll(topics) {
	fs.writeFileSync(STORAGE_PATH, JSON.stringify(topics, null, 2), 'utf-8');
}

function create(topic) {
	const topics = readAll();
	const newTopic = {
		id: crypto.randomUUID(),
		title: topic.title,
		category: topic.category
	};
	topics.push(newTopic);
	writeAll(topics);
	return newTopic;
}

function get(id) {
	const topics = readAll();
	return topics.find((t) => t.id === id) || null;
}

function list(filter = {}) {
	const topics = readAll();
	if (filter.category) {
		return topics.filter((t) => t.category === filter.category);
	}
	return topics;
}

function update(id, changes) {
	const topics = readAll();
	const index = topics.findIndex((t) => t.id === id);
	if (index === -1) return null;
	const updated = { ...topics[index], ...changes, id };
	topics[index] = updated;
	writeAll(topics);
	return updated;
}

function remove(id) {
	const topics = readAll();
	const index = topics.findIndex((t) => t.id === id);
	if (index === -1) return null;
	const [removed] = topics.splice(index, 1);
	writeAll(topics);
	return removed;
}

function findByTitleAndCategory(title, category) {
	const topics = readAll();
	return topics.find((t) => t.title === title && t.category === category) || null;
}

module.exports = {
	create,
	get,
	list,
	update,
	remove,
	findByTitleAndCategory
};
