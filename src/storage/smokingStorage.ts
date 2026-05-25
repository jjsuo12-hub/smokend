import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistRecord, JournalRecord, QuitProfile, SmokingTypeResult } from '@/types/smoking';

const keys = {
  smokingTypeResult: 'smokend.smokingTypeResult',
  quitProfile: 'smokend.quitProfile',
  withdrawalPopupDate: 'smokend.withdrawalPopupDate',
  checklistRecords: 'smokend.checklistRecords',
  journalRecords: 'smokend.journalRecords',
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  if (!value) {
    return fallback;
  }
  return JSON.parse(value) as T;
}

async function writeJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getSmokingTypeResult() {
  return readJson<SmokingTypeResult | null>(keys.smokingTypeResult, null);
}

export async function saveSmokingTypeResult(result: SmokingTypeResult) {
  await writeJson(keys.smokingTypeResult, result);
}

export async function resetSmokingTypeResult() {
  await AsyncStorage.removeItem(keys.smokingTypeResult);
  await AsyncStorage.removeItem(keys.quitProfile);
  await AsyncStorage.removeItem(keys.withdrawalPopupDate);
}

export async function getQuitProfile() {
  return readJson<QuitProfile | null>(keys.quitProfile, null);
}

export async function saveQuitProfile(profile: QuitProfile) {
  await writeJson(keys.quitProfile, profile);
}

export async function getWithdrawalPopupDate() {
  return readJson<string | null>(keys.withdrawalPopupDate, null);
}

export async function saveWithdrawalPopupDate(date: string) {
  await writeJson(keys.withdrawalPopupDate, date);
}

export async function getChecklistRecords() {
  return readJson<ChecklistRecord[]>(keys.checklistRecords, []);
}

export async function addChecklistRecord(record: ChecklistRecord) {
  const records = await getChecklistRecords();
  const nextRecords = [record, ...records];
  await writeJson(keys.checklistRecords, nextRecords);
  return nextRecords;
}

export async function getJournalRecords() {
  return readJson<JournalRecord[]>(keys.journalRecords, []);
}

export async function addJournalRecord(record: JournalRecord) {
  const records = await getJournalRecords();
  const nextRecords = [record, ...records];
  await writeJson(keys.journalRecords, nextRecords);
  return nextRecords;
}
