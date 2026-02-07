import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { dashboardApi } from '../api/authApi';
import { getToken, removeToken } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [loading, setLoading] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        navigation.replace('Login');
        return;
      }

      const res = await dashboardApi(token);
      if (!res?.status) {
        await removeToken();
        navigation.replace('Login');
        return;
      }

      const dynamicColor =
        res?.dashboard?.color?.dynamic_color ?? '#2563eb';

      setThemeColor(dynamicColor);
      setData(res);

      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error('Dashboard API error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load dashboard</Text>
      </View>
    );
  }

  const user = data?.user ?? {};
  const dashboard = data?.dashboard ?? {};

  const amount = dashboard?.amount ?? {
    Paid: 0,
    due: 0,
    Total: 0,
  };

  const student = dashboard?.student ?? {
    Boy: 0,
    Girl: 0,
  };

  const progress =
    amount.Total > 0
      ? Math.min((amount.Paid / amount.Total) * 100, 100)
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={themeColor} barStyle="light-content" />

      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: themeColor,
            opacity: headerAnim,
          },
        ]}
      >
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.username}>{user?.name ?? 'User'}</Text>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.sectionTitle}>Payments</Text>
      <View style={styles.row}>
        <StatCard title="Paid" value={`₹ ${amount.Paid}`} />
        <StatCard title="Due" value={`₹ ${amount.due}`} />
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <StatCard title="Total Amount" value={`₹ ${amount.Total}`} full />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Payment Progress</Text>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: themeColor,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}% Paid
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Students</Text>
      <View style={styles.row}>
        <StatCard title="Boys" value={student.Boy} />
        <StatCard title="Girls" value={student.Girl} />
      </View>

      <TouchableOpacity
        style={[styles.refreshBtn, { borderColor: themeColor }]}
        onPress={loadDashboard}
        activeOpacity={0.85}
      >
        <Text style={[styles.refreshText, { color: themeColor }]}>
          Refresh Dashboard
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardScreen;

const StatCard = ({
  title,
  value,
  full,
}: {
  title: string;
  value: string | number;
  full?: boolean;
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        full && { width: '100%' },
        {
          opacity: fade,
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loader: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcome: {
    color: '#e0f2fe',
    fontSize: 14,
  },
  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  logout: {
    color: '#fff',
    fontWeight: '600',
    borderWidth: 0.5,
    borderColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    margin: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 1,
  },
  cardTitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  progressContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  progressBg: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  refreshBtn: {
    borderWidth: 1.5,
    padding: 14,
    borderRadius: 14,
    margin: 16,
    alignItems: 'center',
  },
  refreshText: {
    fontWeight: '600',
  },
});
