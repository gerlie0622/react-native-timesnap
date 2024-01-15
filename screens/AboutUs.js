import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.heading}>Our Story</Title>

      <Card style={styles.developersCard}>
        <Card.Content>
        Welcome to our app! We founded this company with a shared passion for creating innovative solutions that enhance the user experience and provide value to our clients.
      The idea was born from the realization that we noticed that we should take advantage of modern technology and use it to our advantage. We noticed there was a need for a workplace to be more organized and have an accurate time management system. Motivated by this insight, we embarked on a journey to create a company that stands out in the market.
      </Card.Content>
      </Card>

      <Title style={styles.heading}>Our Background and Team</Title>

      <Card style={styles.developersCard}>
        <Card.Content>
        We are a team of dedicated developers from the Polytechnic University of the Philippines. Our diverse backgrounds and expertise come together to lead this company toward success. As individuals, we bring unique skills and perspectives that contribute to our collective vision.
        </Card.Content>
      </Card>

      <Title style={styles.heading}>Evolution of Our Company</Title>

      <Card style={styles.developersCard}>
        <Card.Content>
        Since our inception, we've faced numerous challenges and celebrated successes. Our journey has been marked by continuous improvement, overcoming obstacles, and evolving to meet the dynamic needs of our users. Each phase of our evolution has shaped the company into what it is today.
        </Card.Content>
      </Card>

      <Title style={styles.heading}>Mission and Vision</Title>

      <Card style={styles.developersCard}>
        <Card.Content>
        Our mission is to deliver high-quality software solutions. We strive for excellence in every project, foster innovation and creativity, and build lasting relationships with our clients and users.
        </Card.Content>
      </Card>

      <Paragraph>
        Looking ahead, our vision is to utilize technology for the betterment of our future. We are committed to taking the necessary steps to transform our business and make a positive impact in the industry.
      </Paragraph>

      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Ann Vergie Adecer</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Passionate about creating user-friendly and innovative solutions.</Paragraph>
          <Paragraph>Fun Fact: Loves experimenting with different art forms and mediums.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Gerlie Iries Dela Cruz</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Enthusiastic about front-end development and UI/UX design.</Paragraph>
          <Paragraph>Fun Fact: Enjoys hiking and exploring new places in her free time.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.developersCard}>
        <Card.Content>
          <Title style={styles.developerName}>Gabriel Alfonso Mapa</Title>
          <Paragraph>4th-year student at PUP</Paragraph>
          <Paragraph>Passionate about back-end development and server-side technologies.</Paragraph>
          <Paragraph>Fun Fact: Enjoys playing musical instruments, particularly the guitar.</Paragraph>
        </Card.Content>
      </Card>

      <Paragraph>"TimeSnap, shaping the future, one tap at a time – revolutionizing workplaces with seamless and accurate time management solutions."</Paragraph>
      
      <Paragraph style={styles.contactInfo}>Contact us for any questions or feedback.</Paragraph>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ADD8E6',
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
  contactInfo: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#333333',
  },
});

export default AboutUs;
