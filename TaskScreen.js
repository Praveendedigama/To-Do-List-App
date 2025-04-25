import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Share,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const TASKS_KEY = 'TASKS_LIST';

export default function TaskScreen() {
  const [inputs, setInputs] = useState({ title: '', about: '' });
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editInputs, setEditInputs] = useState({ title: '', about: '' });
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem(TASKS_KEY);
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {}
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage when changed
  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (inputs.title.trim() && inputs.about.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: inputs.title,
          about: inputs.about,
          completed: false,
        },
      ]);
      setInputs({ title: '', about: '' });
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ visible: true, id });
  };

  const confirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== deleteModal.id));
    setDeleteModal({ visible: false, id: null });
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditInputs({ title: task.title, about: task.about });
  };

  const handleSaveEdit = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id
        ? { ...task, title: editInputs.title, about: editInputs.about }
        : task
    ));
    setEditId(null);
    setEditInputs({ title: '', about: '' });
  };

  const handleShare = async (task) => {
    try {
      await Share.share({
        message: `Task: ${task.title}\nAbout: ${task.about}`,
      });
    } catch (error) {}
  };

  const toggleCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={() => toggleCompleted(item.id)}
      >
        {item.completed ? (
          <Icon name="check-circle" size={24} color="#38ada9" />
        ) : (
          <Icon name="circle" size={24} color="#b8e994" />
        )}
      </TouchableOpacity>
      {editId === item.id ? (
        <View style={{ flex: 1 }}>
          <TextInput
            style={[styles.input, { marginBottom: 6 }]}
            value={editInputs.title}
            placeholder="Title..."
            placeholderTextColor="#3B3B98"
            onChangeText={(text) =>
              setEditInputs((prev) => ({ ...prev, title: text }))
            }
          />
          <TextInput
            style={styles.input}
            value={editInputs.about}
            placeholder="About..."
            placeholderTextColor="#3B3B98"
            onChangeText={(text) =>
              setEditInputs((prev) => ({ ...prev, about: text }))
            }
          />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSaveEdit(item.id)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditId(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.completedText,
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.taskAbout,
              item.completed && styles.completedText,
            ]}
          >
            {item.about}
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash-2" size={20} color="#ee5253" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleShare(item)}
            >
              <Icon name="share-2" size={18} color="#3B3B98" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleEdit(item)}
            >
              <Icon name="edit-2" size={18} color="#f6b93b" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Day's Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No tasks yet! 🎉</Text>
          </View>
        }
      />

      {/* Floating Add Task Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.addBarContainer}
      >
        <View style={styles.addBar}>
          <TextInput
            style={styles.input}
            placeholder="Task title"
            placeholderTextColor="#3B3B98"
            value={inputs.title}
            onChangeText={(text) =>
              setInputs((prev) => ({ ...prev, title: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="About this task"
            placeholderTextColor="#3B3B98"
            value={inputs.about}
            onChangeText={(text) =>
              setInputs((prev) => ({ ...prev, about: text }))
            }
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Icon name="plus" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal({ visible: false, id: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTopBorder} />
            <Text style={styles.modalText}>Delete this task?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButtonYes}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonYesText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonNo}
                onPress={() => setDeleteModal({ visible: false, id: null })}
              >
                <Text style={styles.modalButtonNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F0FF',
    paddingHorizontal: 0,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3B3B98',
    textAlign: 'center',
    marginVertical: 18,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#3B3B98',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  checkButton: {
    marginRight: 14,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    color: '#3B3B98',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskAbout: {
    color: '#222f3e',
    fontSize: 15,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#b8e994',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#b8e994',
  },
  saveButton: {
    backgroundColor: '#38ada9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f6b93b',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  addBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  addBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#3B3B98',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#b8e994',
    borderRadius: 8,
    color: '#3B3B98',
    backgroundColor: '#f7f1e3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#3B3B98',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  noTasksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  noTasksText: {
    color: '#b8e994',
    fontSize: 22,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(59,59,152,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    paddingBottom: 24,
    overflow: 'hidden',
    shadowColor: '#3B3B98',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTopBorder: {
    height: 6,
    width: '100%',
    backgroundColor: '#3B3B98',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalText: {
    color: '#3B3B98',
    fontSize: 22,
    marginVertical: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButtonYes: {
    borderWidth: 2,
    borderColor: '#38ada9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 36,
    marginHorizontal: 12,
    backgroundColor: '#e0f7fa',
  },
  modalButtonNo: {
    borderWidth: 2,
    borderColor: '#ee5253',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 36,
    marginHorizontal: 12,
    backgroundColor: '#fff0f0',
  },
  modalButtonYesText: {
    color: '#38ada9',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonNoText: {
    color: '#ee5253',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
