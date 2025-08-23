import { NextResponse } from 'next/server';
import { validateAreaDefinitions, getAreaStatistics, printAreaInfo } from '@/utils/areaUtils';
import { getAllAreas } from '@/types/areas';

export async function GET() {
  try {
    // エリア定義の検証
    const validation = validateAreaDefinitions();
    
    // 統計情報の取得
    const statistics = getAreaStatistics();
    
    // 全エリア情報の取得
    const areas = getAllAreas();
    
    // コンソールに詳細情報を出力（開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      printAreaInfo();
    }

    return NextResponse.json({
      success: true,
      validation,
      statistics,
      areas: areas.map(area => ({
        id: area.id,
        name: area.name,
        prefectureCount: area.prefectures.length,
        prefectures: area.prefectures,
        center: area.center,
        zoom: area.zoom,
        color: area.color
      }))
    });
  } catch (error) {
    console.error('エリア定義の検証中にエラーが発生しました:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'エリア定義の検証中にエラーが発生しました' 
      },
      { status: 500 }
    );
  }
} 