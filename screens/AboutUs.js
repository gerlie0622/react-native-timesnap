import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.heading}>About Us</Title>

      <Paragraph>Welcome to our app! We are a team of developers from the Polytechnic University of the Philippines.</Paragraph>

      <Paragraph style={styles.missionHeading}>Our Mission</Paragraph>
      <Paragraph style={styles.mission}>
        To deliver high-quality software solutions that enhance the user experience and provide value to our clients.
      </Paragraph>

      <Paragraph style={styles.goalsHeading}>Our Goals</Paragraph>
      <Paragraph style={styles.goals}>
        1. Strive for excellence in every project.
      </Paragraph>
      <Paragraph style={styles.goals}>
        2. Foster innovation and creativity.
      </Paragraph>
      <Paragraph style={styles.goals}>
        3. Build lasting relationships with our clients and users.
      </Paragraph>
      
      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Ann Vergie Adecer</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Passionate about creating user-friendly and innovative solutions.</Paragraph>
          <Paragraph>Favorite Color: Navy Blue</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Gerlie Iries Dela Cruz</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Enthusiastic about front-end development and UI/UX design.</Paragraph>
          <Paragraph>Favorite Color: Blue</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Gabriel Alfonso Mapa</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Passionate about back-end development and server-side technologies.</Paragraph>
          <Paragraph>Favorite Color: White</Paragraph>
        </Card.Content>
      </Card>


      <Paragraph style={styles.contactInfo}>Contact us for any questions or feedback.</Paragraph>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  developersCard: {
    marginVertical: 10,
    elevation: 3,
    backgroundColor: '#E1E8ED', // Navy Blue
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F4E64', // Blue
  },
  missionHeading: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F4E64', // Blue
  },
  mission: {
    color: '#666666',
  },
  goalsHeading: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F4E64', // Blue
  },
  goals: {
    color: '#666666',
  },
  contactInfo: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#333333',
  },
});

export default AboutUs;
