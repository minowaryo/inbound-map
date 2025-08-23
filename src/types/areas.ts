// エリア定義の型
export interface AreaDefinition {
  id: string;
  name: string;
  prefectures: string[];
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  color: string;
}

// 8エリア分類の定義
export const AREA_DEFINITIONS: Record<string, AreaDefinition> = {
  hokkaido: {
    id: 'hokkaido',
    name: '北海道',
    prefectures: ['北海道'],
    center: { lat: 43.064359, lng: 141.346814 },
    zoom: 6,
    color: '#FF6B6B'
  },
  tohoku: {
    id: 'tohoku',
    name: '東北',
    prefectures: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
    center: { lat: 39.703619, lng: 141.152684 },
    zoom: 6,
    color: '#4ECDC4'
  },
  kanto: {
    id: 'kanto',
    name: '関東',
    prefectures: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
    center: { lat: 35.676191, lng: 139.650309 },
    zoom: 7,
    color: '#45B7D1'
  },
  chubu: {
    id: 'chubu',
    name: '中部',
    prefectures: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
    center: { lat: 36.204824, lng: 138.252924 },
    zoom: 6,
    color: '#96CEB4'
  },
  kinki: {
    id: 'kinki',
    name: '近畿',
    prefectures: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
    center: { lat: 34.690083, lng: 135.195511 },
    zoom: 7,
    color: '#FFEAA7'
  },
  chugoku: {
    id: 'chugoku',
    name: '中国',
    prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'],
    center: { lat: 34.661751, lng: 133.934444 },
    zoom: 6,
    color: '#DDA0DD'
  },
  shikoku: {
    id: 'shikoku',
    name: '四国',
    prefectures: ['徳島県', '香川県', '愛媛県', '高知県'],
    center: { lat: 33.841647, lng: 133.750127 },
    zoom: 7,
    color: '#98D8C8'
  },
  kyushu: {
    id: 'kyushu',
    name: '九州・沖縄',
    prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
    center: { lat: 32.750286, lng: 130.667364 },
    zoom: 6,
    color: '#F7DC6F'
  }
};

// 都道府県からエリアを取得する関数
export function getAreaByPrefecture(prefecture: string): AreaDefinition | null {
  for (const area of Object.values(AREA_DEFINITIONS)) {
    if (area.prefectures.includes(prefecture)) {
      return area;
    }
  }
  return null;
}

// エリアIDからエリア定義を取得する関数
export function getAreaById(areaId: string): AreaDefinition | null {
  return AREA_DEFINITIONS[areaId] || null;
}

// 全エリアのリストを取得する関数
export function getAllAreas(): AreaDefinition[] {
  return Object.values(AREA_DEFINITIONS);
}

// エリア名からエリアIDを取得する関数
export function getAreaIdByName(areaName: string): string | null {
  for (const [id, area] of Object.entries(AREA_DEFINITIONS)) {
    if (area.name === areaName) {
      return id;
    }
  }
  return null;
} 