import { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

interface Person {
  id: string;
  name: string;
  lockedWith?: string; // ID of the person they're locked with
}

interface Team {
  id: string;
  members: Person[];
}

export default function TeamGenerator() {
  const { t } = useLanguage();
  const [people, setPeople] = useState<Person[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState('2');
  const [newPersonName, setNewPersonName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    
    const newPerson: Person = {
      id: Math.random().toString(36).substring(7),
      name: newPersonName.trim()
    };
    
    setPeople(prev => [...prev, newPerson]);
    setNewPersonName('');
    setError(null);
  };

  const removePerson = (id: string) => {
    setPeople(prev => {
      const person = prev.find(p => p.id === id);
      if (person?.lockedWith) {
        // Also unlock the paired person
        return prev
          .filter(p => p.id !== id)
          .map(p => p.id === person.lockedWith ? { ...p, lockedWith: undefined } : p);
      }
      return prev.filter(p => p.id !== id);
    });
    setTeams([]);
  };

  const toggleLock = (person1Id: string, person2Id: string) => {
    setPeople(prev => {
      const person1 = prev.find(p => p.id === person1Id);
      const person2 = prev.find(p => p.id === person2Id);
      
      if (!person1 || !person2) return prev;
      
      // If already locked together, unlock them
      if (person1.lockedWith === person2Id) {
        return prev.map(p => 
          p.id === person1Id || p.id === person2Id 
            ? { ...p, lockedWith: undefined }
            : p
        );
      }
      
      // If either is locked with someone else, unlock first
      return prev.map(p => {
        if (p.id === person1Id) return { ...p, lockedWith: person2Id };
        if (p.id === person2Id) return { ...p, lockedWith: person1Id };
        if (p.lockedWith === person1Id || p.lockedWith === person2Id) {
          return { ...p, lockedWith: undefined };
        }
        return p;
      });
    });
    setTeams([]);
  };

  const generateTeams = useCallback(() => {
    if (people.length < 2) {
      setError(t('teamGenerator.notEnoughPeople'));
      return;
    }

    const numTeams = parseInt(numberOfTeams);
    if (numTeams < 2 || numTeams > people.length) {
      setError(t('teamGenerator.invalidTeams'));
      return;
    }

    // Create a copy of people to shuffle
    let availablePeople = [...people];
    
    // First, handle locked pairs
    const lockedPairs = new Set<string>();
    const pairedPeople = availablePeople.filter(p => {
      if (p.lockedWith && !lockedPairs.has(p.id)) {
        lockedPairs.add(p.id);
        lockedPairs.add(p.lockedWith);
        return true;
      }
      return false;
    });

    // Remove paired people from available pool
    availablePeople = availablePeople.filter(p => !lockedPairs.has(p.id));

    // Shuffle available people
    for (let i = availablePeople.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePeople[i], availablePeople[j]] = [availablePeople[j], availablePeople[i]];
    }

    // Create empty teams
    const newTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: `team-${i + 1}`,
      members: []
    }));

    // First distribute locked pairs
    pairedPeople.forEach((person, index) => {
      const teamIndex = index % numTeams;
      const pair = people.find(p => p.id === person.lockedWith);
      if (pair) {
        newTeams[teamIndex].members.push(person, pair);
      }
    });

    // Then distribute remaining people
    availablePeople.forEach((person, index) => {
      // Find team with fewest members
      const teamIndex = newTeams
        .map((team, idx) => ({ idx, count: team.members.length }))
        .sort((a, b) => a.count - b.count)[0].idx;
      newTeams[teamIndex].members.push(person);
    });

    setTeams(newTeams);
    setError(null);
  }, [people, numberOfTeams, t]);

  const reset = () => {
    setPeople([]);
    setTeams([]);
    setNumberOfTeams('2');
    setError(null);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
      <Text style={styles.title}>{t('teamGenerator.title')}</Text>
      <Text style={styles.description}>{t('teamGenerator.description')}</Text>

      {/* Add Person Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPersonName}
          onChangeText={setNewPersonName}
          placeholder={t('teamGenerator.personName')}
          onSubmitEditing={addPerson}
        />
        <Pressable 
          style={styles.addButton}
          onPress={addPerson}>
          <Text style={styles.buttonText}>{t('teamGenerator.addPerson')}</Text>
        </Pressable>
      </View>

      {/* People List */}
      <View style={styles.peopleContainer}>
        {people.map((person, index) => (
          <View key={person.id} style={styles.personItem}>
            <Text style={styles.personName}>{person.name}</Text>
            <View style={styles.personActions}>
              {person.lockedWith && (
                <Text style={styles.lockedText}>
                  {t('teamGenerator.lockedWith')}: {people.find(p => p.id === person.lockedWith)?.name}
                </Text>
              )}
              {index < people.length - 1 && (
                <Pressable
                  style={styles.lockButton}
                  onPress={() => toggleLock(person.id, people[index + 1].id)}>
                  <Text style={styles.buttonText}>
                    {person.lockedWith === people[index + 1].id
                      ? t('teamGenerator.unlockPeople')
                      : t('teamGenerator.lockPeople')}
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={styles.removeButton}
                onPress={() => removePerson(person.id)}>
                <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Team Size Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={numberOfTeams}
          onChangeText={setNumberOfTeams}
          keyboardType="numeric"
          placeholder={t('teamGenerator.numberOfTeams')}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.generateButton}
          onPress={generateTeams}>
          <Text style={styles.buttonText}>{t('teamGenerator.generate')}</Text>
        </Pressable>
        
        <Pressable
          style={styles.resetButton}
          onPress={reset}>
          <Text style={styles.buttonText}>{t('teamGenerator.reset')}</Text>
        </Pressable>
      </View>

      {/* Teams Display */}
      {teams.length > 0 ? (
        <View style={styles.teamsContainer}>
          {teams.map((team, index) => (
            <View key={team.id} style={styles.teamCard}>
              <Text style={styles.teamTitle}>
                {t('teamGenerator.team')} {index + 1}
              </Text>
              {team.members.map(member => (
                <Text key={member.id} style={styles.teamMember}>
                  {member.name}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noTeamsText}>{t('teamGenerator.noTeams')}</Text>
      )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 'auto',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6C5CE7',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  peopleContainer: {
    marginBottom: 24,
    width: '100%',
  },
  personItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  personName: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  personActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  lockButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
    alignSelf: 'center',
  },
  lockedText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    width: '100%',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  generateButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#6C5CE7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  teamsContainer: {
    gap: 16,
    width: '100%',
  },
  teamCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  teamMember: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#6C5CE7',
  },
  noTeamsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 24,
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
});