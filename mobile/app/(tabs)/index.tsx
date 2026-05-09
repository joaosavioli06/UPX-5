import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.header}>

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Bem-vindo(a),</Text>

            <Text style={styles.name}>Livia Borba</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.unit}>
          <View>
            <Text style={styles.unitTitle}>Unidade</Text>

            <Text style={styles.block}>Bloco A - Apto 101</Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>Ativo</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridCard}>
          <Ionicons name="calendar-outline" size={36} color={'#374151'} />

          <Text style={styles.gridText}>
            Reservas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard}>
          <Ionicons name="notifications-outline" size={36} color={'#374151'} />

          <Text style={styles.gridText}>
            Avisos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard}>
          <Ionicons name="card-outline" size={36} color={'#374151'} />

          <Text style={styles.gridText}>
            Boletos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard}>
          <Ionicons name="trash-outline" size={36} color={'#374151'} />

          <Text style={styles.gridText}>
            Descarte
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsIcon}>📋</Text>

          <Text style={styles.eventsTitle}>
            Próximos eventos
          </Text>
        </View>

        <View style={styles.eventItem}>

          <View style={styles.dateBoxGreen}>
            <Text style={styles.monthGreen}>ABR</Text>
            <Text style={styles.dayGreen}>25</Text>
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>
              Assembleia Ordinária
            </Text>

            <Text style={styles.eventSubtitle}>
              19:00 - Salão de festas
            </Text>
          </View>

        </View>

        <View style={styles.eventItem}>

          <View style={styles.dateBoxGray}>
            <Text style={styles.monthGray}>MAI</Text>
            <Text style={styles.dayGray}>01</Text>
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>
              Vencimento do condomínio
            </Text>

            <Text style={styles.eventSubtitle}>
              R$ 850,00
            </Text>
          </View>

        </View>

      </View>

      <TouchableOpacity
        onPress={() => router.push('/(auth)/login')}
        style={styles.logoutButton}>
        <Text style={styles.logoutText}>
          Sair da conta
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    // justifyContent: 'center',
    padding: 20,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    backgroundColor: '#00A63E',
    borderRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#009130',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#DCFCE7',
    fontSize: 14,
    marginBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  unit: {
    backgroundColor: '#0eb64c',
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  unitTitle: {
    fontSize: 14,
    color: '#DCFCE7',
    marginBottom: 14,
  },
  block: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeBadge: {
    backgroundColor: '#11da61',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 16,
  },
  gridCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  gridText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'medium',
    color: '#101828',
  },
  eventsCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  eventsIcon: {
    fontSize: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'semibold',
    color: '#101828',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBoxGreen: {
    width: 48,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  monthGreen: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  dayGreen: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 'bold',
    color: '#15803D',
  },
  dateBoxGray: {
    width: 48,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  monthGray: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  dayGray: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 'bold',
    color: '#374151',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  eventSubtitle: {
    fontSize: 12,
    color: '#6A7282',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 36,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 14,
    color: '#6A7282',
    fontWeight: 'medium',
  },
});
