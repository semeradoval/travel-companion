const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORAGE_PATH = path.join(__dirname, '..', 'storage', 'entries.json');

function readAll() {
	const raw = fs.readFileSync(STORAGE_PATH, 'utf-8');
	return JSON.parse(raw);
}

function writeAll(entries) {
	fs.writeFileSync(STORAGE_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

function create(entry) {
	const entries = readAll();
	const newEntry = {
		id: crypto.randomUUID(),
		title: entry.title,
		text: entry.text,
		topicId: entry.topicId
	};
	entries.push(newEntry);
	writeAll(entries);
	return newEntry;
}

function get(id) {
	const entries = readAll();
	return entries.find((e) => e.id === id) || null;
}

function list(filter = {}) {
	const entries = readAll();
	if (filter.topicId) {
		return entries.filter((e) => e.topicId === filter.topicId);
	}
	return entries;
}

function update(id, changes) {
	const entries = readAll();
	const index = entries.findIndex((e) => e.id === id);
	if (index === -1) return null;
	const updated = { ...entries[index], ...changes, id };
	entries[index] = updated;
	writeAll(entries);
	return updated;
}

function remove(id) {
	const entries = readAll();
	const index = entries.findIndex((e) => e.id === id);
	if (index === -1) return null;
	const [removed] = entries.splice(index, 1);
	writeAll(entries);
	return removed;
}

function removeAllByTopicId(topicId) {
	const entries = readAll();
	const remaining = entries.filter((e) => e.topicId !== topicId);
	const removedCount = entries.length - remaining.length;
	if (removedCount > 0) {
		writeAll(remaining);
	}
	return removedCount;
}

module.exports = {
	create,
	get,
	list,
	update,
	remove,
	removeAllByTopicId
};
