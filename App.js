import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-chooser';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'Non-serializable values were found in the navigation state',
]);

const INITIAL_TASKS = [
  { id: '1', name: 'Comprar mantimentos', emoji: '🛒', category: 'Casa', done: false },
  { id: '2', name: 'Fazer exercício', emoji: '🏃', category: 'Saúde', done: false },
  { id: '3', name: 'Responder e-mails', emoji: '📧', category: 'Trabalho', done: false },
  { id: '4', name: 'Ler um livro', emoji: '📚', category: 'Lazer', done: true },
  { id: '5', name: 'Ligar para a família', emoji: '📞', category: 'Pessoal', done: true },
];

function getFormattedDate() {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function TaskItem({ task, onToggle }) {
  return (
    <View style={styles.taskItem}>
      <Checkbox
        value={task.done}
        onValueChange={() => onToggle(task.id)}
        color={task.done ? '#6C63FF' : '#CCCCCC'}
        style={styles.checkbox}
      />
      {task.done ? (
      
        <Text style={[styles.taskName, styles.taskNameDone]} numberOfLines={1}>
          {task.emoji} {task.name}
        </Text>
      ) : (
   
        <>
          <Text style={styles.taskEmoji}>{task.emoji}</Text>
          <View style={styles.taskInfo}>
            <Text style={styles.taskName} numberOfLines={1}>
              {task.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const [modalVisible, setModalVisible] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📝');
  const [newCategory, setNewCategory] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const pendingTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const openModal = () => {
    setNewName('');
    setNewEmoji('📝');
    setNewCategory('');
    setShowEmojiPicker(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setShowEmojiPicker(false);
    setModalVisible(false);
  };

  const addTask = () => {
    if (!newName.trim()) return;
    const task = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji,
      category: newCategory.trim() || 'Geral',
      done: false,
    };
    setTasks((prev) => [task, ...prev]);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.appTitle}>Minhas Tarefas</Text>
        <Text style={styles.dateText}>{getFormattedDate()}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <MaterialIcons name="pending-actions" size={14} color="#FF6B6B" />
            <Text style={[styles.statText, { color: '#FF6B6B' }]}>
              {pendingTasks.length} pendente{pendingTasks.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: '#E8F5E9' }]}>
            <MaterialIcons name="check-circle" size={14} color="#4CAF50" />
            <Text style={[styles.statText, { color: '#4CAF50' }]}>
              {completedTasks.length} realizada{completedTasks.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <MaterialIcons name="radio-button-unchecked" size={18} color="#FF6B6B" />
          <Text style={styles.sectionTitle}>Pendentes</Text>
          <View style={[styles.sectionCount, { backgroundColor: '#FFE5E5' }]}>
            <Text style={[styles.sectionCountText, { color: '#FF6B6B' }]}>
              {pendingTasks.length}
            </Text>
          </View>
        </View>
        {pendingTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>Tudo em dia!</Text>
          </View>
        ) : (
          pendingTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))
        )}

        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Realizadas</Text>
          <View style={[styles.sectionCount, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.sectionCountText, { color: '#4CAF50' }]}>
              {completedTasks.length}
            </Text>
          </View>
        </View>
        {completedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>Nenhuma tarefa concluída ainda</Text>
          </View>
        ) : (
          completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal} activeOpacity={0.85}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >

        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.kavWrapper}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Nova Tarefa</Text>

              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Estudar para a prova..."
                placeholderTextColor="#BBBBBB"
                value={newName}
                onChangeText={setNewName}
                returnKeyType="next"
                maxLength={60}
              />

              <View style={styles.emojiCategoryRow}>
                <View style={styles.emojiSection}>
                  <Text style={styles.inputLabel}>Emoji</Text>
                  <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={() => setShowEmojiPicker((v) => !v)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiPreview}>{newEmoji}</Text>
                    <MaterialIcons
                      name={showEmojiPicker ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={16}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.categorySection}>
                  <Text style={styles.inputLabel}>Categoria</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    placeholder="Ex: Trabalho, Casa..."
                    placeholderTextColor="#BBBBBB"
                    value={newCategory}
                    onChangeText={setNewCategory}
                    maxLength={30}
                  />
                </View>
              </View>

              {showEmojiPicker && (
                <View style={styles.emojiPickerWrapper}>
                  <EmojiSelector
                    onSelect={(emoji) => {
                      setNewEmoji(emoji);
                      setShowEmojiPicker(false); // fecha automaticamente ao selecionar
                    }}
                    showSearchBar={true}
                    showHistory={true}
                    showSectionTitles={false}
                    columns={8}
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.addButton, { flexShrink: 0 }]}
                onPress={addTask}
                activeOpacity={0.85}
              >
                <MaterialIcons name="add-task" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const PURPLE = '#6C63FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4FB',
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
  },
  sectionCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  taskEmoji: {
    fontSize: 26,
    marginHorizontal: 12,
  },
  taskInfo: {
    flex: 1,
    gap: 4,
  },
  taskName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginLeft: 12,
    flex: 1,
  },
  taskNameDone: {
    textDecorationLine: 'line-through',
    color: '#BBBBBB',
    fontWeight: '400',
  },
  categoryBadge: {
    backgroundColor: '#F0EEFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: PURPLE,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: {
    color: '#BBBBBB',
    fontSize: 14,
    fontWeight: '500',
  },

  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    backgroundColor: PURPLE,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  kavWrapper: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    // Limita a altura para não cobrir toda a tela
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 20,
    letterSpacing: -0.3,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A2E',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  emojiCategoryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  emojiSection: {
    width: 90,
  },
  categorySection: {
    flex: 1,
  },
  emojiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    height: 46,
  },
  emojiPreview: {
    fontSize: 24,
  },

  emojiPickerWrapper: {
    height: 260,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },

  addButton: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});