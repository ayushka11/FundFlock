export interface Rule {
    rule?: number,
    triggerValue?: number
}
export interface KycRule {
    activeRule: number,
    availableRules: Rule[]
}