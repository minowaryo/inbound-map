import { AREA_DEFINITIONS, getAreaByPrefecture, getAllAreas } from '../types/areas';

// エリア定義の検証関数
export function validateAreaDefinitions(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 全エリアの基本チェック
  const areas = getAllAreas();
  
  if (areas.length !== 8) {
    errors.push(`エリア数が8個ではありません: ${areas.length}個`);
  }

  // 2. 各エリアの詳細チェック
  areas.forEach(area => {
    // 必須フィールドのチェック
    if (!area.id || !area.name || !area.prefectures || !area.center) {
      errors.push(`${area.name}: 必須フィールドが不足しています`);
    }

    // 都道府県リストのチェック
    if (area.prefectures.length === 0) {
      errors.push(`${area.name}: 都道府県が設定されていません`);
    }

    // 座標の妥当性チェック
    if (area.center.lat < 20 || area.center.lat > 50 || 
        area.center.lng < 120 || area.center.lng > 150) {
      warnings.push(`${area.name}: 座標が日本国内の範囲外の可能性があります`);
    }

    // ズームレベルの妥当性チェック
    if (area.zoom < 4 || area.zoom > 10) {
      warnings.push(`${area.name}: ズームレベルが適切でない可能性があります: ${area.zoom}`);
    }
  });

  // 3. 都道府県の重複チェック
  const allPrefectures = areas.flatMap(area => area.prefectures);
  const uniquePrefectures = new Set(allPrefectures);
  
  if (allPrefectures.length !== uniquePrefectures.size) {
    errors.push('都道府県に重複があります');
  }

  // 4. 全47都道府県の網羅性チェック
  const expectedPrefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県',
    '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const missingPrefectures = expectedPrefectures.filter(pref => !allPrefectures.includes(pref));
  if (missingPrefectures.length > 0) {
    errors.push(`未設定の都道府県: ${missingPrefectures.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// エリア統計情報を取得する関数
export function getAreaStatistics(): {
  totalAreas: number;
  totalPrefectures: number;
  areaPrefectureCounts: Record<string, number>;
  averagePrefecturesPerArea: number;
} {
  const areas = getAllAreas();
  const areaPrefectureCounts: Record<string, number> = {};
  
  areas.forEach(area => {
    areaPrefectureCounts[area.name] = area.prefectures.length;
  });

  const totalPrefectures = areas.reduce((sum, area) => sum + area.prefectures.length, 0);
  const averagePrefecturesPerArea = totalPrefectures / areas.length;

  return {
    totalAreas: areas.length,
    totalPrefectures,
    areaPrefectureCounts,
    averagePrefecturesPerArea
  };
}

// エリア情報を表示する関数（デバッグ用）
export function printAreaInfo(): void {
  console.log('=== エリア定義情報 ===');
  
  const validation = validateAreaDefinitions();
  console.log('検証結果:', validation.isValid ? '✅ 正常' : '❌ エラーあり');
  
  if (validation.errors.length > 0) {
    console.log('エラー:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.log('警告:', validation.warnings);
  }

  const stats = getAreaStatistics();
  console.log('統計情報:', stats);

  console.log('\n=== エリア詳細 ===');
  getAllAreas().forEach(area => {
    console.log(`${area.name}: ${area.prefectures.length}都道府県`);
    console.log(`  都道府県: ${area.prefectures.join(', ')}`);
    console.log(`  中心座標: ${area.center.lat}, ${area.center.lng}`);
    console.log(`  ズーム: ${area.zoom}`);
    console.log(`  色: ${area.color}`);
    console.log('');
  });
} 