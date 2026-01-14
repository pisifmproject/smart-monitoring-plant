// frontend\src\lib\api.ts
import axios from "axios";
import type { LvmdpRow } from "@/types";

export type LvmdpRaw = {
  waktu: string;
  totalKwh: number;
  realPower?: number;
  cosPhi: number;
  freq: number;
  avgLineLine: number;
  avgLineNeut: number;
  avgCurrent: number;
  currentR: number;
  currentS: number;
  currentT: number;
  voltageRS: number;
  voltageST: number;
  voltageTR: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Track backend connection status
let isBackendConnected = true;
let lastErrorTime = 0;

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    /* 
    if (!isBackendConnected) {
      isBackendConnected = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('backend-reconnected'));
      }
    }
    */
    return response;
  },
  (error) => {
    const now = Date.now();
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // Only show warning once per 10 seconds
    /*
    if (now - lastErrorTime > 10000) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        isBackendConnected = false;
        lastErrorTime = now;
        
        // Show popup warning
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('backend-disconnected', {
            detail: { message: 'Backend connection lost. Retrying...' }
          });
          window.dispatchEvent(event);
        }
      }
    }
    */
    
    return Promise.reject(error);
  }
);

export function isBackendOnline(): boolean {
  return isBackendConnected;
}

// ---------- LIST ----------
export async function getLvmdp(id: 1 | 2 | 3 | 4): Promise<LvmdpRow[]> {
  // backend kamu masih /lvmdp1, /lvmdp2, ...
  const { data } = await api.get(`/lvmdp${id}`);
  return Array.isArray(data) ? data : data?.data ?? [];
}
// helper lama tetap ada biar mudah pindah
export const getLvmdp1 = () => getLvmdp(1);
export const getLvmdp2 = () => getLvmdp(2);
export const getLvmdp3 = () => getLvmdp(3);
export const getLvmdp4 = () => getLvmdp(4);

export async function getLvmdpLatest(panelId: number) {
  try {
    const { data } = await api.get(`/lvmdp/${panelId}/latest`, {
      params: { _t: Date.now() },
    });
    return data;
  } catch (error: any) {
    throw error;
  }
}
export const getLvmdp1Latest = () => getLvmdpLatest(1);
export const getLvmdp2Latest = () => getLvmdpLatest(2);
export const getLvmdp3Latest = () => getLvmdpLatest(3);
export const getLvmdp4Latest = () => getLvmdpLatest(4);

// Batch fetch all LVMDP panels at once (optimized - single API call)
export async function getLvmdpAllLatest() {
  try {
    const { data } = await api.get(`/lvmdp/all/latest`, {
      params: { _t: Date.now() },
    });
    return data as {
      panels: {
        1: LvmdpRaw | null;
        2: LvmdpRaw | null;
        3: LvmdpRaw | null;
        4: LvmdpRaw | null;
      };
      _meta: {
        fetchTime: number;
        timestamp: string;
      };
    };
  } catch (error: any) {
    throw error;
  }
}

// Get shift data for today
export async function getLvmdpShiftToday(panelId: 1 | 2 | 3 | 4, date?: string) {
  try {
    const { data } = await api.get(`/lvmdp/${panelId}/shift-today`, {
      params: { 
        _t: Date.now(),
        date 
      },
    });
    return data as {
      date: string;
      shift1: {
        totalKwh: number;
        avgKwh: number;
        avgCurrent: number;
        minCurrent: number;
        maxCurrent: number;
        cosPhi: number;
      };
      shift2: {
        totalKwh: number;
        avgKwh: number;
        avgCurrent: number;
        minCurrent: number;
        maxCurrent: number;
        cosPhi: number;
      };
      shift3: {
        totalKwh: number;
        avgKwh: number;
        avgCurrent: number;
        minCurrent: number;
        maxCurrent: number;
        cosPhi: number;
      };
    };
  } catch (error: any) {
    throw error;
  }
}

// Get trend data for LVMDP
export async function getLvmdpTrend(
  panelId: 1 | 2 | 3 | 4,
  period: "day" | "week" | "month" | "year",
  date?: string
) {
  try {
    const { data } = await api.get(`/lvmdp/${panelId}/trend`, {
      params: {
        period,
        date: date || new Date().toISOString().split("T")[0],
        _t: Date.now(),
      },
    });
    return data as {
      period: string;
      labels: string[];
      data: number[];
      unit: string;
    };
  } catch (error: any) {
    throw error;
  }
}

// Get HMI data (R, S, T current and voltage)
export async function getLvmdpHMI(panelId: 1 | 2 | 3 | 4) {
  const path = { 1: "/lvmdp1", 2: "/lvmdp2", 3: "/lvmdp3", 4: "/lvmdp4" }[
    panelId
  ];
  const { data } = await api.get(`${path}/hmi`);
  return data as {
    currentR: number;
    currentS: number;
    currentT: number;
    voltageRS: number;
    voltageST: number;
    voltageTR: number;
  };
}

export async function getShiftAvg(panelId: 1 | 2 | 3 | 4, date?: string) {
  const path = { 1: "/lvmdp1", 2: "/lvmdp2", 3: "/lvmdp3", 4: "/lvmdp4" }[
    panelId
  ];
  const { data } = await api.get(`${path}/shift-avg`, { params: { date } });
  return data as {
    shift1: {
      avgPower: number;
      avgCurrent: number;
      minCurrent: number;
      maxCurrent: number;
      count: number;
    };
    shift2: {
      avgPower: number;
      avgCurrent: number;
      minCurrent: number;
      maxCurrent: number;
      count: number;
    };
    shift3: {
      avgPower: number;
      avgCurrent: number;
      minCurrent: number;
      maxCurrent: number;
      count: number;
    };
  };
}

// ---------- DAILY REPORT ALL DATES ----------
export async function getDailyReportAll(panelId: 1 | 2 | 3 | 4) {
  // Backend yang kita harapkan:
  // GET /api/lvmdp1/daily-report/all  -> { success:true, data:[ {date,shift1,shift2,shift3}, ... ] }
  const { data } = await api.get(`/lvmdp${panelId}/daily-report/all`);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.reports)) return data.data.reports;
  return [];
}

// ---------- DAILY HOURLY REPORT ----------
export async function getDailyHourly(panelId: 1 | 2 | 3 | 4, date: string) {
  // Backend yang kita harapkan:
  // GET /api/lvmdp1/daily-report/hourly/:date  -> Array of hourly data
  const { data } = await api.get(
    `/lvmdp${panelId}/daily-report/hourly/${date}`
  );

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// ---------- UTILITY CONSUMPTION ----------
export async function getUtilityConsumption(
  machineId: string,
  utilityType: string,
  period: "daily" | "monthly" = "daily",
  date?: string
) {
  const { data } = await api.get(`/utility/${machineId}/consumption`, {
    params: { type: utilityType, period, date },
  });
  return data as {
    daily: { current: number; target: number; yesterday: number };
    monthly: { current: number; target: number; lastMonth: number };
    unit: string;
  };
}

export async function getUtilityTrend(
  machineId: string,
  utilityType: string,
  range: "7days" | "30days" | "12months" = "7days"
) {
  const { data } = await api.get(`/utility/${machineId}/trend`, {
    params: { type: utilityType, range },
  });
  return data as Array<{ date: string; value: number; target?: number }>;
}

export async function getUtilitySummary(machineId: string, date?: string) {
  const { data } = await api.get(`/utility/${machineId}/summary`, {
    params: { date },
  });
  return data;
}

// ---------- MACHINE PROCESS DATA ----------
export async function getMachineProcessData(plantId: string, machineId: string) {
  const { data } = await api.get(`/machine/${plantId}/${machineId}/process`, {
    params: { _t: Date.now() },
  });
  return data as {
    productName: string;
    operatingMode: string;
    systemStatus: number;
    plcCommsStatus: string;
    feedFromCratesStatus: string;
    peelerOperationalStatus: string;
    potatoPrepControlMode: string;
    slicersControlMode: string;
    washerDrivesControlMode: string;
    potatoFeedOperationalStatus: string;
    slicersInclinePercentage: number;
    headTemperature: number;
    peelerRotationalSpeed: number;
    peelerLoadPercentage: number;
    washerLevelPercentage: number;
    washerFlowRate: number;
    mainOilCirculationRate: number;
    oilCirculationControlValue: number;
    fryerInletTemperature: number;
    fryerInletSetpoint: number;
    fryerOutletTemperature: number;
    temperatureDelta: number;
    burnerOutputPercentage: number;
    usedOilPercentage: number;
    newOilPercentage: number;
    oilLevelMillimeters: number;
    oilQualityStatus: string;
    valveOutputPercentage: number;
    actualMoistureContent: number;
    moistureSetpoint: number;
    actualOilContent: number;
    oilContentSetpoint: number;
    masterSpeedPercentage: number;
    masterSpeedLinearValue: number;
    paddleSpeedPercentage: number;
    submergerSpeedPercentage: number;
    takeoutSpeedPercentage: number;
    fryerOutfeedControlMode: string;
    takeoutConveyorStatus: string;
    postFryerControlMode: string;
    sliceThickness: number;
    potatoSolidsPercentage: number;
    timestamp: string;
  };
}

// ---------- MACHINE PERFORMANCE DATA ----------
export async function getMachinePerformanceData(plantId: string, machineId: string) {
  const { data } = await api.get(`/machine/${plantId}/${machineId}/performance`, {
    params: { _t: Date.now() },
  });
  return data as {
    oeePercentage: number;
    availabilityPercentage: number;
    performancePercentage: number;
    qualityPercentage: number;
    rejectRate: number;
    actualProduction: number;
    targetProduction: number;
    runRate: number;
    runRateUnit: string;
    timestamp: string;
  };
}

// ---------- MACHINE UTILITY DATA ----------
export async function getMachineUtilityData(plantId: string, machineId: string) {
  const { data } = await api.get(`/machine/${plantId}/${machineId}/utility`, {
    params: { _t: Date.now() },
  });
  return data as {
    electricalPower: number;
    steamConsumption: number;
    waterConsumption: number;
    compressedAirConsumption: number;
    timestamp: string;
  };
}


// ---------- PLANT DASHBOARD DATA ----------
export async function getPlantDashboard(plantId: string) {
  const { data } = await api.get(`/plants/${plantId}/dashboard`, {
    params: { _t: Date.now() },
  });
  return data;
}

// ---------- PLANT MACHINES ----------
export async function getPlantMachines(plantId: string) {
  const { data } = await api.get(`/plants/${plantId}/machines`, {
    params: { _t: Date.now() },
  });
  return data;
}


// ---------- AUTH API ----------
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    name: string | null;
    role: string;
    plantAccess: string[] | null;
  };
  token?: string;
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

// ---------- USER MANAGEMENT ----------
export interface UserData {
  id?: number;
  username: string;
  corporateId: string;
  password?: string;
  name: string;
  role: string;
  plantAccess: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(user: UserData) {
  const { data } = await api.post("/users", user);
  return data;
}

export async function updateUser(id: number, user: Partial<UserData>) {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
}

export async function deleteUser(id: number) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}
