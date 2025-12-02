type TabletCTAProps = {
  onPrev: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
}

export default function TabletCTA({
  onPrev,
  onNext,
  prevLabel = '← 이전 단계',
  nextLabel = '다음 단계 →',
  nextDisabled
}: TabletCTAProps) {
  return (
    <div className="bottom-cta">
      <div>
        <button className="btn" style={{ minWidth: '140px' }} onClick={onPrev}>
          {prevLabel}
        </button>
      </div>
      <div className="cta-buttons">
        <button
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
          onClick={onNext}
          disabled={!onNext || nextDisabled}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
